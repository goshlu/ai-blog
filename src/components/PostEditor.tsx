"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

interface Tag {
  name: string;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: Tag[];
}

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    tags: post?.tags?.map((t) => t.name) || ([] as string[]),
  });
  const [tagInput, setTagInput] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleAddTag = (e?: React.KeyboardEvent | React.FocusEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? {
            // 更新时以原 slug 为主键，暂不在此修改 slug，避免冲突
            slug: post?.slug,
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            tags: formData.tags.map((tag: string) => ({ name: tag })),
          }
        : {
            ...formData,
            date: new Date().toISOString().split("T")[0],
            tags: formData.tags.map((tag: string) => ({ name: tag })),
          };

      const response = await fetch("/api/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "文章保存成功！" });
        setTimeout(() => {
          router.push("/admin/posts");
          router.refresh();
        }, 1000);
      } else {
        setMessage({ type: "error", text: result.error || "保存失败" });
      }
    } catch {
      setMessage({ type: "error", text: "网络错误，请重试" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!formData.title.trim()) {
      setMessage({
        type: "error",
        text: "请先填写文章标题，再让 AI 生成内容。",
      });
      return;
    }

    // 确定与现有内容的合并策略（覆盖 or 追加），只询问一次
    const hasExisting = !!formData.content.trim();
    let replaceExisting = !hasExisting;
    let baseContent = "";

    if (hasExisting) {
      const confirmReplace = window.confirm(
        "当前已有正文内容，是否用 AI 生成的内容覆盖？\n选择“取消”则会在末尾追加。",
      );
      replaceExisting = confirmReplace;
      baseContent = confirmReplace
        ? ""
        : `${formData.content.trim()}\n\n---\n\n`;
    }

    setIsGeneratingContent(true);
    setMessage(null);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
        }),
      });

      if (!res.ok) {
        setMessage({ type: "error", text: "AI 生成失败，请稍后重试。" });
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setMessage({
          type: "error",
          text: "无法读取 AI 返回的数据流，请重试。",
        });
        return;
      }

      let generated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              generated += delta;
              const nextContent =
                (replaceExisting ? "" : baseContent) + generated;
              setFormData((prev) => ({
                ...prev,
                content: nextContent,
              }));
            }
          } catch {
            // 忽略单行解析错误
          }
        }
      }

      if (generated.trim()) {
        setMessage({
          type: "success",
          text: "AI 正文生成完成，你可以继续手动修改。",
        });
      } else {
        setMessage({ type: "error", text: "AI 没有返回内容，请重试。" });
      }
    } catch (error) {
      console.error("Generate content error:", error);
      setMessage({ type: "error", text: "AI 生成出错，请检查网络后重试。" });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            文章标题 *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData((prev) => ({
                ...prev,
                title,
                slug: prev.slug || generateSlug(title),
              }));
            }}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            placeholder="输入文章标题"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            URL Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            disabled={isEdit}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            placeholder="url-slug"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          文章摘要
        </label>
        <input
          type="text"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          placeholder="简短描述文章内容"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          文章标签
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 text-xs border border-pink-100 dark:border-pink-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-pink-800 dark:hover:text-pink-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          onBlur={() => handleAddTag()}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          placeholder="输入标签并按回车添加"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            文章内容 (Markdown) *
          </label>
          <button
            type="button"
            onClick={handleGenerateContent}
            disabled={isGeneratingContent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40 transition-colors"
          >
            {isGeneratingContent ? "AI 正在写作…" : "用 AI 生成正文"}
          </button>
        </div>
        <textarea
          required
          rows={20}
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all font-mono text-sm"
          placeholder="# 标题&#10;&#10;文章内容..."
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/25"
        >
          {isSaving ? "保存中..." : post ? "更新文章" : "发布文章"}
        </button>

        <Link
          href="/admin/posts"
          className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          取消
        </Link>
      </div>
    </form>
  );
}

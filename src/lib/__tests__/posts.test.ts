import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "../posts";

describe("getAllPosts", () => {
  it("应该返回所有文章", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it("应该按日期降序排序", () => {
    const posts = getAllPosts();

    for (let i = 0; i < posts.length - 1; i++) {
      const currentDate = new Date(posts[i].date);
      const nextDate = new Date(posts[i + 1].date);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });

  it("每篇文章应该包含必需字段", () => {
    const posts = getAllPosts();

    posts.forEach((post) => {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("date");
      expect(post).toHaveProperty("excerpt");
      expect(post).toHaveProperty("content");
      expect(post).toHaveProperty("tags");

      expect(typeof post.slug).toBe("string");
      expect(typeof post.title).toBe("string");
      expect(typeof post.date).toBe("string");
      expect(typeof post.content).toBe("string");
    });
  });
});

describe("getPostBySlug", () => {
  it("应该通过 slug 找到文章", () => {
    const posts = getAllPosts();
    const firstPost = posts[0];

    const found = getPostBySlug(firstPost.slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(firstPost.slug);
  });

  it("应该在找不到文章时返回 undefined", () => {
    const found = getPostBySlug("non-existent-slug");
    expect(found).toBeUndefined();
  });

  it("应该返回完整的文章数据", () => {
    const posts = getAllPosts();
    if (posts.length > 0) {
      const found = getPostBySlug(posts[0].slug);

      expect(found).toHaveProperty("title");
      expect(found).toHaveProperty("content");
      expect(found).toHaveProperty("date");
      expect(found).toHaveProperty("excerpt");
    }
  });
});

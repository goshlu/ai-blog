"use server";

import { cookies } from "next/headers";
import { generateSummary } from "@/lib/ai";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

interface SummaryState {
  summary: string | null;
  title: string | null;
  error: string | null;
}

async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifyAdminSessionToken(token) : false;
}

export async function generateSummaryAction(
  prevState: SummaryState,
  formData: FormData,
): Promise<SummaryState> {
  // 验证管理员身份
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return {
      summary: null,
      title: null,
      error: "未授权：请先登录管理后台",
    };
  }

  const content = formData.get("content") as string;
  const title = formData.get("title") as string;

  if (!content || content.trim() === "") {
    return { summary: null, title: null, error: "文章内容不能为空" };
  }

  try {
    const summary = await generateSummary(content);
    return { summary, title, error: null };
  } catch (error) {
    console.error("Action error:", error);
    return { summary: null, title: null, error: "生成摘要失败，请重试" };
  }
}

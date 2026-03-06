/**
 * 安全配置检查脚本
 * 运行: npx tsx scripts/security-check.ts
 */

import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

// 加载 .env.local
config({ path: resolve(process.cwd(), ".env.local") });

function checkEnvVar(name: string, required: boolean = false): boolean {
  const value = process.env[name];
  const exists = Boolean(value && value.trim());

  const status = exists ? "✅" : required ? "❌" : "⚠️";
  const label = required ? "必需" : "可选";

  console.log(
    `  ${status} ${name}: ${exists ? "已设置" : "未设置"} (${label})`,
  );

  return exists || !required;
}

function checkPasswordStrength(password: string): void {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  console.log("\n密码强度检查:");
  console.log(
    `  长度: ${length} 字符 ${length >= 12 ? "✅" : "❌ (建议至少 12 字符)"}`,
  );
  console.log(`  大写字母: ${hasUpper ? "✅" : "⚠️"}`);
  console.log(`  小写字母: ${hasLower ? "✅" : "⚠️"}`);
  console.log(`  数字: ${hasNumber ? "✅" : "⚠️"}`);
  console.log(`  特殊字符: ${hasSpecial ? "✅" : "⚠️"}`);

  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;
  const strength = score >= 4 ? "强" : score >= 3 ? "中等" : "弱";
  console.log(`  综合评分: ${strength} ${score >= 3 ? "✅" : "⚠️"}`);
}

async function main() {
  console.log("🔒 安全配置检查\n");
  console.log("=".repeat(50));

  console.log("\n环境变量检查:");
  const hasAdminPassword = checkEnvVar("ADMIN_PASSWORD", true);
  checkEnvVar("ADMIN_SESSION_SECRET", false);
  checkEnvVar("OPENAI_API_KEY", true);

  console.log("\n数据库配置:");
  const hasTurso = checkEnvVar("TURSO_DATABASE_URL", false);
  if (hasTurso) {
    checkEnvVar("TURSO_AUTH_TOKEN", true);
  } else {
    checkEnvVar("DATABASE_URL", false);
  }

  console.log("\n可选配置:");
  checkEnvVar("NEXT_PUBLIC_SITE_URL", false);
  checkEnvVar("SUBSCRIPTION_WEBHOOK_URL", false);

  // 检查密码强度
  if (hasAdminPassword) {
    const password = process.env.ADMIN_PASSWORD!;
    checkPasswordStrength(password);
  }

  console.log("\n" + "=".repeat(50));
  console.log("\n安全建议:");
  console.log("  1. 使用强密码（至少 12 字符，包含大小写、数字、特殊字符）");
  console.log("  2. 不要将 .env.local 提交到版本控制");
  console.log("  3. 生产环境使用 HTTPS");
  console.log("  4. 定期更换管理员密码");
  console.log("  5. 监控异常登录尝试");

  console.log("\n✨ 检查完成！\n");
}

main().catch(console.error);

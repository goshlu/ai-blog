import { generateSummary } from '@/lib/ai';
import { posts } from './posts';

async function updatePostSummaries() {
  console.log('开始为文章生成摘要...\n');

  for (const post of posts) {
    console.log(`正在处理: ${post.title}`);
    
    try {
      const summary = await generateSummary(post.content);
      console.log(`生成的摘要: ${summary}\n`);
      
      // 这里可以更新数据库或文件
      // 当前只是演示，实际项目中会将摘要保存到数据源
    } catch (error) {
      console.error(`处理 ${post.title} 时出错:`, error);
    }
  }

  console.log('完成！');
}

updatePostSummaries().catch(console.error);

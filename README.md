# hermes-agent-refactoring

基于 **Hermes Agent** 框架，结合 **Gemini** 和 **GPT** 打造的企业级遗留代码自动化重构与审查平台。

## 🎯 核心痛点与解决方案
企业中存在大量老旧的单体架构代码（如 PHP、Java），面临极高的维护成本与安全风险（如 SQL 注入、代码高度耦合）。人工重构费时费力。
本项目通过构建多 Agent 协同工作流，实现**一键式代码审计、逻辑提取、跨语言翻译（转为现代化 Go 微服务）及自我纠错**。

## 🧠 核心逻辑流与多 Agent 协作
本项目利用了长链路推理 (Chain-of-Thought) 和多智能体协作：
1. **Analyzer Agent (分析者):** 扫描源文件生成 AST，精准识别出诸如 SQL 注入风险及前后端耦合等架构缺陷。
2. **Planner Agent (规划者):** 启动长链推理，决定解耦策略，规划 RESTful JSON API 规范。
3. **Coder Agent (编码者):** 调用 GPT/Gemini 底座大模型，执行从老旧代码到 Go 语言高并发微服务的范式翻译。
4. **Reviewer Agent (审查者):** 实施自我纠错（Self-Correction），检验新生成代码的安全规范与 HTTP 状态码标准。

## 🛠 技术栈
* 核心框架：Hermes Agent
* 底层模型：GPT Series, Gemini Series
* 演示端：HTML5, JavaScript, Prism.js (完全运行于前端沙盒)

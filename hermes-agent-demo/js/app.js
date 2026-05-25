const agentLogs = [
    { agent: "System", msg: "初始化 Hermes Agent 框架，挂载多模态底座...", type: "info", delay: 500 },
    { agent: "Analyzer Agent", msg: "读取遗留代码。检测语言: PHP 5.x. 分析 AST 中...", type: "info", delay: 800 },
    { agent: "Analyzer Agent", msg: "⚠️ 警告：检测到严重漏洞！存在 SQL 拼接注入风险 (变量 $userId).", type: "warning", delay: 1200 },
    { agent: "Planner Agent", msg: "启动长链推理(Chain-of-Thought)... 决定剥离 HTML 视图层，采用 RESTful JSON 规范重构.", type: "info", delay: 1500 },
    { agent: "Coder Agent", msg: "调用 GPT/Gemini 核心进行跨语言范式翻译，目标语言: Go...", type: "info", delay: 1000 },
    { agent: "Coder Agent", msg: "生成 Go 语言微服务代码，引入 database/sql 和参数化查询防注入.", type: "success", delay: 1500 },
    { agent: "Reviewer Agent", msg: "启动自我纠错(Self-Correction)与交叉代码审查...", type: "info", delay: 1200 },
    { agent: "Reviewer Agent", msg: "✅ 审查通过！完全符合现代微服务高并发与安全标准。", type: "success", delay: 800 },
    { agent: "System", msg: "重构任务完成。本次执行消耗约 2300 Tokens。", type: "success", delay: 500 }
];

const targetCode = `package main

import (
\t"database/sql"
\t"encoding/json"
\t"log"
\t"net/http"
\t_ "github.com/go-sql-driver/mysql"
)

type User struct {
\tID    int    \`json:"id"\`
\tName  string \`json:"name"\`
\tEmail string \`json:"email"\`
}

// GetUserHandler 提供 RESTful API 获取用户信息
func GetUserHandler(db *sql.DB) http.HandlerFunc {
\treturn func(w http.ResponseWriter, r *http.Request) {
\t\tuserID := r.URL.Query().Get("id")
\t\tif userID == "" {
\t\t\thttp.Error(w, "Missing user ID", http.StatusBadRequest)
\t\t\treturn
\t\t}

\t\tvar user User
\t\t// 使用参数化查询 (?), 彻底杜绝 SQL 注入风险
\t\tquery := "SELECT id, name, email FROM users WHERE id = ?"
\t\terr := db.QueryRow(query, userID).Scan(&user.ID, &user.Name, &user.Email)

\t\tw.Header().Set("Content-Type", "application/json")
\t\tif err != nil {
\t\t\tif err == sql.ErrNoRows {
\t\t\t\thttp.Error(w, \`{"error": "User not found"}\`, http.StatusNotFound)
\t\t\t\treturn
\t\t\t}
\t\t\thttp.Error(w, \`{"error": "Internal server error"}\`, http.StatusInternalServerError)
\t\t\treturn
\t\t}

\t\tjson.NewEncoder(w).Encode(user)
\t}
}`;

async function startAgent() {
    const btn = document.getElementById('start-btn');
    const terminal = document.getElementById('terminal-panel');
    const outputCodeElem = document.getElementById('output-code');
    
    btn.disabled = true; btn.innerText = "⏳ Agent 协同推理中...";
    outputCodeElem.textContent = "// Agent 正在思考和编写代码...\n";
    Prism.highlightElement(outputCodeElem);
    terminal.innerHTML = ''; 

    for (let i = 0; i < agentLogs.length; i++) {
        const log = agentLogs[i];
        await new Promise(resolve => setTimeout(resolve, log.delay));
        
        const timeStr = new Date().toLocaleTimeString();
        let cssClass = "log-info";
        if(log.type === "success") cssClass = "log-success";
        if(log.type === "warning") cssClass = "log-warning";

        const logHtml = `<div><span class="log-time">[${timeStr}]</span><span class="log-agent">[${log.agent}]</span><span class="${cssClass}">${log.msg}</span></div>`;
        terminal.insertAdjacentHTML('beforeend', logHtml);
        terminal.scrollTop = terminal.scrollHeight;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    outputCodeElem.textContent = "";
    let codeIndex = 0;
    
    function typeCode() {
        if (codeIndex < targetCode.length) {
            outputCodeElem.textContent += targetCode.substring(codeIndex, codeIndex + 4);
            codeIndex += 4;
            Prism.highlightElement(outputCodeElem);
            setTimeout(typeCode, 10);
        } else {
            btn.innerText = "✅ 重构完成";
            terminal.insertAdjacentHTML('beforeend', `<div><span class="blink">_</span></div>`);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }
    typeCode();
}
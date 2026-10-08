# 🎓 AI 编程教学实训大本营 (AI Learning Platform)

> **中央教学病例库与分歧仲裁社区**  
> 遵循《AI 编程教学 Agent 学习工具设计图》与《补充构想：落地硬约束与关键缺口》规范。  
> **审查是入口，构建是目标。能跑测试验证的，不靠 AI 打分！**

---

## 📚 阶梯式递进实训题库 (Graded Curriculum)

本项目整理了**按难度从入门到大师级逐层递进**的标准教学病例库：

### 🟢 Level 1: 基础入门 (Novice)
| 任务编号 | 任务名称 | 核心陷阱与能力维度 |
|---|---|---|
| `task_01_falsy_null_coercion` | **YAML/环境变量解析中的隐式假值类型转换陷阱** | `val || def` 导致空串误判回退；边界条件、空值安全 |
| `task_02_array_pagination_boundary` | **列表分页与滑动窗口中的 Off-by-one 越界** | 分页计算 `<=` 符号导致末页仍显示下一页；边界计算 |
| `task_03_json_deep_clone_prototype` | **对象深拷贝中的原型链枚举与原型污染防护** | `for...in` 遍历原型属性与 `__proto__` 注入防护 |

### 🟡 Level 2: 进阶实战 (Intermediate)
| 任务编号 | 任务名称 | 核心陷阱与能力维度 |
|---|---|---|
| `task_04_async_unhandled_rejection` | **异步任务队列中的未捕获异常导致管道中断** | 前置任务 Rejected 导致 Promise 链断裂；错误处理与异步管道 |
| `task_05_timer_resource_leak` | **长轮询与心跳定时器未清理引起的句柄泄漏** | 连续 start 造成孤儿定时器常驻与内存泄漏；资源生命周期 |
| `task_06_state_pollution_class_instance` | **AI 将瞬态结果保存在类实例属性导致状态串话** | 实例属性保存批处理结果导致重用污染；AI 专项审查 |

### 🟠 Level 3: 高阶深水 (Advanced)
| 任务编号 | 任务名称 | 核心陷阱与能力维度 |
|---|---|---|
| `task_07_cache_stampede_singleflight` | **高并发异步 LRU 缓存击穿与 Singleflight 合并** | 在途并发 Promise 共享与清理；高并发、性能优化 |
| `task_08_path_traversal_sanitization` | **静态文件服务器黑名单过滤双写绕过与逃逸** | `....//` 绕过简单正则清洗；路径安全、白名单前缀 |
| `task_09_deadlock_lock_ordering` | **多资源并发互斥锁顺序不一致引发的死锁** | 双向并发转账死锁；锁顺序字典序规范化 |

### 🔴 Level 4: 架构大师 (Master)
| 任务编号 | 任务名称 | 核心陷阱与能力维度 |
|---|---|---|
| `task_10_snowflake_clock_rollback` | **分布式雪花算法时钟回拨处理与并发 ID 碰撞** | NTP 同步导致物理时钟倒退防御；分布式系统架构 |
| `task_11_idempotent_event_dedup` | **乱序消息消费中的幂等去重窗口失效** | Check-then-act 竞态导致重复入账；原子化幂等性 |
| `task_12_fsm_mutation_defense` | **复杂订单业务状态机重构与深层变异测试防御** | 状态机转移表重构，杜绝非法状态跃迁；变异测试防御 |

---

## 🚀 学员如何使用？

1. 在 DeepSeek Harness 桌面端模式切换中选择 **「学习模式」**；
2. 插件会自动从本仓库实时拉取最新阶梯式题目；
3. 自动在本地创建 `./learning-sandbox` 演练目录，强制执行 5 步构建闭环：
   1. **写失败测试**：证明缺陷真实存在；
   2. **修复缺陷**：通过回归并击败变异测试；
   3. **从零重写**：脱离 AI，独立手搓重写等价实现；
   4. **替代设计**：设计另一种架构并深度说明优劣取舍；
   5. **8维系统复盘**：剖析 AI 错因与思维盲区，沉淀自检清单。
4. 遇到与 AI 的判定分歧时，一键同步到本仓库 **Discussions (Q&A)** 发起同行复现仲裁！

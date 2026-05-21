# CANGO 数据质检报告

- 生成时间：2026-05-21 17:26:42
- 机构总数：203
- 问题统计：ERROR 11 / WARN 181 / INFO 57

## 分布校验

| 维度 | 实际 | 预期 |
|---|---:|---:|
| 欧洲 | 95 | 95 |
| 亚洲 | 69 | 69 |
| 北美 | 28 | 28 |
| 南美/拉美 | 4 | 4 |
| 非洲 | 4 | 4 |
| 大洋洲 | 3 | 3 |
| 亚洲子区域：东亚 | 42 | 42 |
| 亚洲子区域：东南亚 | 19 | 19 |
| 亚洲子区域：南亚 | 4 | 4 |
| 亚洲子区域：中亚 | 2 | 2 |
| 亚洲子区域：中东 | 2 | 2 |

## 待核查清单

| 级别 | 机构 | 字段 | 问题 | 当前值 | 建议 |
|---|---|---|---|---|---|
| ERROR | BBC World Service Trust | statusNote | 运营状态说明疑似提到其他机构：BBC Media Action | 已停止独立运营，2011年后正式改名为 BBC Media Action，原品牌已停用。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | East Asia Climate Network | statusNote | 运营状态说明疑似提到其他机构：Plan International | 正常运营：作为EANET（Acid Deposition Monitoring Network in East Asia），网站（eanet.asia）活跃；2026年工作计划、监测数据发布和Medium-Term Plan 2026-2030已批准并实施。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | Evangelischer Entwicklungsdienst | statusNote | 运营状态说明疑似提到其他机构：Bread for the World | 已于2012年并入 Brot für die Welt，原机构品牌不再独立存在，但其职能与项目在新架构内继续运作，视为“并入重组型正常存续”。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | Evangelisches Zentralstelle für Entwicklungshilfe | statusNote | 运营状态说明疑似提到其他机构：Bread for the World | 已于1999年并入 EED，并最终于2012年随同 EED 一并整合入 Brot für die Welt。现不再作为独立机构存在，属于“历史整合型，已注销”。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | Friends of the Earth Germany | statusNote | 运营状态说明疑似提到其他机构：Bread for the World | 正常运营， 官方网站（bread.org）有2024-2025年的报告和活动，包括饥饿政策分析和人道主义援助项目。2025年德国分部（Brot für die Welt）开展全国性水资源和粮食安全活动。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | Friends of the Earth Germany | statusNote | 运营状态说明包含与官网不一致的域名：bread.org | 正常运营， 官方网站（bread.org）有2024-2025年的报告和活动，包括饥饿政策分析和人道主义援助项目。2025年德国分部（Brot für die Welt）开展全国性水资源和粮食安全活动。 | 优先核对该行是否引用了其他机构官网或状态说明。 |
| ERROR | HSBC Global Private Banking | statusNote | 运营状态说明包含与官网不一致的域名：privatebanking.hsbc.com | 正常运营：官方网站 privatebanking.hsbc.com 活跃，2025-2026 年任命新领导；持续发布媒体声明、全球企业家财富报告和财富管理服务。 | 优先核对该行是否引用了其他机构官网或状态说明。 |
| ERROR | Lancang-Mekong Development Foundation | statusNote | 运营状态说明疑似提到其他机构：Plan International | 正常运营：官方网站（thelmdf.org）已更新并活跃；参与2025-2026年Lancang-Mekong Cooperation (LMC) 活动，包括区域合作项目和战略计划支持（如MI Strategic Plan 2026-2030的关联框架）。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | TT Foundation Advisors | statusNote | 运营状态说明疑似提到其他机构：Plan International | 正常运营：作为私人基金会顾问或支持服务常见术语/实体，相关指南和规划工具持续更新（如 Foundation Planning Guide for Advisors 和私人基金会合规指南）；多家顾问公司（如 Foundation Source）提供相关服务，活跃于慈善规划领域。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | The Danish Centre for Human Rights | statusNote | 运营状态说明疑似提到其他机构：Danish Institute for Human Rights | 已停止独立运营（2002年并入DIHR）。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| ERROR | WINGS for Asia | statusNote | 运营状态说明疑似提到其他机构：Worldwide Initiatives for Grantmaker Support | 正常运营：作为 WINGS 网络亚洲分支持续活跃，支持区域慈善发展。 | 回到 Excel 对该行状态说明做人工核对，确认是否串行。 |
| WARN | ADRA Canada | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | ADRA Canada | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营 |  |
| WARN | ATD Fourth World | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Accountability Counsel | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布案例与政策更新） |  |
| WARN | Al-Mujadilah Center & Mosque for Women | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布活动） |  |
| WARN | American Bar Association | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | American Bar Association | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新，近年持续发布政策声明与法治项目报告） |  |
| WARN | Areopagos Foundation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Asia House Denmark | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布活动） |  |
| WARN | Asia Pacific Philanthropy Consortium | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Asia-Pacific Association of Agricultural Research Institutions | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Asia-Pacific Research Network | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Association des Entreprises Chinoises en France | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营 |  |
| WARN | Australian Agency for International Development | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Australian Agency for International Development | website | 官网字段包含空格，可能混入备注 | 已无独立官网（现并入 https://www.dfat.gov.au） |  |
| WARN | BBC World Service Trust | website | 官网字段不像 URL 或域名 | 现已并入 BBC Media Action |  |
| WARN | BalkanKids Foundation | body | 关键字段为空或仅包含缺省说明 | 未检索到权威官网或注册信息，疑似为小型或已不活跃的区域性基金会。缺乏明确法律注册、总部地址及持续运营记录。 |  |
| WARN | BalkanKids Foundation | country | 关键字段为空或仅包含缺省说明 | 找不到相关信息 |  |
| WARN | BalkanKids Foundation | functionStd | 关键字段为空或仅包含缺省说明 | 找不到相关信息 |  |
| WARN | BalkanKids Foundation | natureStd | 关键字段为空或仅包含缺省说明 | 找不到相关信息 |  |
| WARN | Bill & Melinda Gates Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Bill & Melinda Gates Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新2024-2025年度报告与项目公告） |  |
| WARN | Bread for All | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Bread for All | website | 官网字段包含空格，可能混入备注 | 原官网已整合（现为 https://www.brot-fuer-alle.ch 重定向） |  |
| WARN | Bread for the World | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Business for Social Responsibility | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Business for Social Responsibility | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025年持续发布研究报告与企业合作项目） |  |
| WARN | CARE International | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | CESIE | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | CONCORD Europe | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Cambodia YMCA | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Canadian International Development Agency | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Caritas Australia | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Caritas Denmark | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Carnegie Mellon University | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Carnegie Mellon University | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新2024-2025学术与科研信息） |  |
| WARN | Center for Environment | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Center for Environmental Concerns Philippines | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Charles Léopold Mayer Foundation for the Progress of Humankind | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | China Council for the Promotion of International Trade Representative Office in Thailand | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营 |  |
| WARN | Civic Initiatives Support Center | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Civic Initiatives Support Center | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（区域公开资料显示仍在本国开展项目） |  |
| WARN | Clean Air Asia | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Climate Action Network Europe | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Cooperation Committee for Cambodia | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Danish Institute for Human Rights | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Department for Environment, Food and Rural Affairs | functionStd | 关键字段为空或仅包含缺省说明 |  |  |
| WARN | East Asia Climate Network | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Empact Pte. Ltd. | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新） |  |
| WARN | Environmental Defense Fund | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Environmental Defense Fund | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布2024-2025年度气候与环境政策更新） |  |
| WARN | European Commission | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | FHI 360 | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | FHI 360 | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目与技术报告） |  |
| WARN | Feminist League | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Feminist League | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（区域公开资料显示持续开展妇女权利项目） |  |
| WARN | Fern | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Food for the Hungry Japan | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Ford Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Ford Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新2024-2025年度资助与战略报告） |  |
| WARN | Formaper – Agency of Milan Chamber of Commerce, Industry, Handcraft and Agriculture | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Foundation for Advanced Studies on International Development | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Fundación CODESPA | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Fundación Protestante Hora de Obrar | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目与新闻） |  |
| WARN | Give2Asia | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Give2Asia | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目与合作信息） |  |
| WARN | Great Britain China Center | functionStd | 关键字段为空或仅包含缺省说明 |  |  |
| WARN | Greenpeace International | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Greenpeace International | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布全球与区域行动报告） |  |
| WARN | Grow Climate Fund | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布项目信息） |  |
| WARN | HSBC Global Private Banking | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（集团2024-2026持续发布年度报告与市场更新） |  |
| WARN | HSBC Global Private Banking | natureStd | 关键字段为空或仅包含缺省说明 | 金融机构 (Financial Institution) |  |
| WARN | Hiroshima University | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | ING Insurance–CPAFFC Fund | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Independent Sector | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Independent Sector | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布政策声明与行业研究） |  |
| WARN | Institute for Sustainable Energy Policies | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Instituto Brasileiro de Análises Sociais e Econômicas | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Instituto Brasileiro de Análises Sociais e Econômicas | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布研究报告与公共倡议活动） |  |
| WARN | Instituto de Desenvolvimento Sustentável | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（有限公开信息） |  |
| WARN | InterAction | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | InterAction | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续更新政策与成员活动信息） |  |
| WARN | International Committee on Fundraising Organizations | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | International Rivers | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | International Rivers | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目报告与政策更新） |  |
| WARN | International Union for Conservation of Nature | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Internationale Weiterbildung und Entwicklung gGmbH | website | 官网字段不像 URL 或域名 | 官网已合并至 GIZ |  |
| WARN | Japan Alliance for Nuclear Weapons Abolition Studies | body | 关键字段为空或仅包含缺省说明 | JANUS 为关注核裁军与和平研究议题的日本民间倡导与研究平台，公开资料较为有限，未检索到完整法人登记或独立官网信息，推测为学术或倡导合作机制。 |  |
| WARN | Japan Alliance for Nuclear Weapons Abolition Studies | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Japan Association of Charitable Organizations | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Japan Bank for International Cooperation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Japan Bank for International Cooperation | functionStd | 关键字段为空或仅包含缺省说明 | 政策性金融机构 (Policy Financial Institution) |  |
| WARN | Japan Federation of Senior Citizens’ Clubs | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Japan International Cooperation Agency | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Japan International Institute for Volunteering Research | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Japan International Institute for Volunteering Research | website | 官网字段包含空格，可能混入备注 | 官方网站（http://www.jivri.jp/ 或 http://www.jivri.org/） |  |
| WARN | Japan Kansai NPO Alliance | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Japan Platform | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Keidanren Committee on Nature Conservation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Konkuk University | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Korea Forum of Volunteerism | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Korea International Cooperation Agency | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Korean Civil Society Forum on International Development Cooperation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Korean NGO Council for Overseas Development Cooperation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Korean Sharing Movement | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Kyoto Saga University of Arts | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | LEF-Italia | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | LUMIQUE Gesellschaft für strategische Managementservices mbH | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（商业咨询机构） |  |
| WARN | Lancang-Mekong Development Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Local Development Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（公开信息有限） |  |
| WARN | Mae Fah Luang Foundation under Royal Patronage | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布项目） |  |
| WARN | Mama Cash | email | 邮箱格式需要人工确认 | https://www.mamacash.org |  |
| WARN | Mama Cash | website | 官网字段不像 URL 或域名 | -9204 |  |
| WARN | Micron Memory Taiwan Co., Ltd. | body | 关键字段为空或仅包含缺省说明 | Micron Memory Taiwan Co., Ltd. 是美国 Micron Technology, Inc. 在台湾设立的主要半导体制造子公司，成立于2003年前后。公司专注于DRAM与NAND存储器的研发与生产，是全球存储芯片产业的重要制造基地之一。除核心制造业务外，公司亦开展企业社会责… |  |
| WARN | Micron Memory Taiwan Co., Ltd. | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（全球半导体制造企业） |  |
| WARN | Myriad Australia | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目与年度信息） |  |
| WARN | Nanyang Technological University | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Nanyang Technological University | title | 关键字段为空或仅包含缺省说明 | Nanyang Technological University |  |
| WARN | Nasdaq Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Nasdaq Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布资助项目与年度公益信息） |  |
| WARN | National Democratic Institute | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | National Democratic Institute | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布项目报告与全球动态） |  |
| WARN | Nepal China Academy | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | New Energy Nexus | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2026持续发布创业支持项目） |  |
| WARN | Niwano Peace Foundation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Northeast Asia Regional Peacebuilding Institute | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Norwegian Lutheran Mission | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Oak Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Oak Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布资助项目与年度报告） |  |
| WARN | Open Forum for CSO Development Effectiveness | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Organization of Islamic Cooperation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2026持续发布会议与政策声明） |  |
| WARN | Oxfam Novib | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Peace Boat | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Pepperdine University | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Pepperdine University | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布招生与学术信息） |  |
| WARN | Philippine-China Development Resource Center | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Plan International | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | Plan International | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布全球项目与年度报告） |  |
| WARN | Population and Community Development Association | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布项目） |  |
| WARN | RMI | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2026持续发布能源与气候报告） |  |
| WARN | Re-Course | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布政策评论） |  |
| WARN | Romanian Association Against AIDS | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Sovereign Forest | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新） |  |
| WARN | Spaces Impact | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续更新） |  |
| WARN | Sungkonghoe University | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Südwind | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | TT Foundation Advisors | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营 |  |
| WARN | Tanzania-China Friendship Promotion Association | functionStd | 关键字段为空或仅包含缺省说明 |  |  |
| WARN | Tanzania-China Friendship Promotion Association | natureStd | 关键字段为空或仅包含缺省说明 |  |  |
| WARN | Thailand Environment Institute Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网持续发布研究报告） |  |
| WARN | The Asia Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The Asia Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025年持续发布项目与报告更新） |  |
| WARN | The Buddhist NGO Network | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | The Conference Board | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The Conference Board | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布全球经济与企业研究报告） |  |
| WARN | The Danish Centre for Human Rights | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | The Energy Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The Energy Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续更新能源与气候政策资助信息） |  |
| WARN | The Japan Foundation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | The Reality of Aid Network | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The Resource Alliance | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2026持续发布活动） |  |
| WARN | The Rockefeller Brothers Fund | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The Rockefeller Brothers Fund | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布资助公告与年度报告） |  |
| WARN | The SASAKAWA Japan-China Friendship Fund | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | The Sasakawa Peace Foundation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | The UPS Foundation | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The UPS Foundation | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续更新企业社会责任与公益项目） |  |
| WARN | The US-China Business Council | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | The US-China Business Council | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布政策分析与企业调查报告） |  |
| WARN | United Way Worldwide | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | United Way Worldwide | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续更新全球网络活动与年度报告） |  |
| WARN | Urgewald e.V. | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2026持续发布金融监督报告） |  |
| WARN | WINGS for Asia | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（作为WINGS区域单元持续开展活动） |  |
| WARN | Wild Geese Foundation | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | WildAid | contactName/contactTitle | 联系人和职位完全相同 | 找不到相关信息 |  |
| WARN | WildAid | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布全球与中国项目更新） |  |
| WARN | World Council of Churches | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | World Rural Forum | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | World Wide Fund for Nature in China | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| WARN | Worldwide Initiatives for Grantmaker Support | cooperationStatus | 合作状态字段疑似混入说明性长文本或运营状态 | 正常运营（官网2024-2025持续发布全球网络活动） |  |
| WARN | YouNet | contactName/contactTitle | 联系人和职位完全相同 | 机构 |  |
| INFO | ATD Fourth World | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Areopagos Foundation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Asia House Denmark；Spaces Impact | email | 同一邮箱被 2 家机构使用：tkr@asia-house.dk |  | 若为统一咨询邮箱可忽略；否则检查联系人字段是否复制错行。 |
| INFO | Australian Agency for International Development | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Bread for All | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Bread for the World | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Bread for the World；Evangelischer Entwicklungsdienst | website | 同一官网域名被 2 家机构使用：brot-fuer-die-welt.de |  | 若为联盟/母机构网站可忽略；否则检查官网是否复制错行。 |
| INFO | CARE International | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | CESIE | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | CONCORD Europe | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Caritas Australia | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Caritas Denmark | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Center for Environment | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Charles Léopold Mayer Foundation for the Progress of Humankind | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Climate Action Network Europe | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Danish Institute for Human Rights | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | European Commission | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Fern | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Formaper – Agency of Milan Chamber of Commerce, Industry, Handcraft and Agriculture | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Fundación CODESPA | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Greenpeace East Asia；Greenpeace International | website | 同一官网域名被 2 家机构使用：greenpeace.org |  | 若为联盟/母机构网站可忽略；否则检查官网是否复制错行。 |
| INFO | ING Insurance–CPAFFC Fund | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | International Committee on Fundraising Organizations | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | International Union for Conservation of Nature | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Japan Bank for International Cooperation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Japan International Cooperation Agency | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Japan Platform | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Keidanren Committee on Nature Conservation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Konkuk University | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Korea Forum of Volunteerism | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Korea International Cooperation Agency | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Korean Civil Society Forum on International Development Cooperation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Korean NGO Council for Overseas Development Cooperation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Korean Sharing Movement | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Kyoto Saga University of Arts | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | LEF-Italia | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Mama Cash | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Niwano Peace Foundation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Northeast Asia Regional Peacebuilding Institute | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Norwegian Lutheran Mission | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Oxfam Novib | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Peace Boat | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Romanian Association Against AIDS | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Sungkonghoe University | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Südwind | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | The Buddhist NGO Network | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | The Danish Centre for Human Rights | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | The Japan Foundation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | The SASAKAWA Japan-China Friendship Fund | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | The SASAKAWA Japan-China Friendship Fund；The Sasakawa Peace Foundation | website | 同一官网域名被 2 家机构使用：spf.org |  | 若为联盟/母机构网站可忽略；否则检查官网是否复制错行。 |
| INFO | The Sasakawa Peace Foundation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Wild Geese Foundation | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | World Council of Churches | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | World Rural Forum | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | World Wide Fund for Nature in China | contactName | 联系人字段为泛化占位内容 | 机构 |  |
| INFO | Worldwide Initiatives for Grantmaker Support；WINGS for Asia | website | 同一官网域名被 2 家机构使用：wingsweb.org |  | 若为联盟/母机构网站可忽略；否则检查官网是否复制错行。 |
| INFO | YouNet | contactName | 联系人字段为泛化占位内容 | 机构 |  |

## 使用说明

- `ERROR`：优先核对，通常表示数量口径、区域映射、重复名称或疑似串行字段。
- `WARN`：建议人工确认，通常表示格式异常、关键字段缺省或字段内容混入其他类型信息。
- `INFO`：提示性信息，可能是合理共享字段，也可能帮助发现复制错行。

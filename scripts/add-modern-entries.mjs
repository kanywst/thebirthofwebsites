#!/usr/bin/env node
/**
 * Append 2005-2026 entries that are missing from info.json.
 * Re-runnable: skips entries whose `name` already exists.
 *
 * Dates are verified via authoritative sources (vendor blog, Wikipedia,
 * primary release announcements). See commit message for source list.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const path = resolve(process.cwd(), "info.json")
const items = JSON.parse(readFileSync(path, "utf8"))

const eraOf = (date) => (date >= "2019-05-01" ? "令和" : date >= "1989-01-08" ? "平成" : "昭和")

const NEW = [
  // ===== Pre-2022 prerequisites missing from the dataset =====
  {
    date: "2005-10-07",
    name: "Google Reader",
    type: ["service", "アメリカ"],
    img: "googlereader.svg",
    nationality: "United-States-of-America",
    description:
      "GoogleがChris Wetherellを中心に開発したRSSフィードリーダー。2005年10月の公開後、RSS文化の中心的存在となったが、2013年7月1日にサービス終了。代替サービス（Feedly等）への移行を促す形でRSSコミュニティに大きな影響を残した。",
    description_en:
      "Google's RSS feed reader, launched October 2005, became the de facto center of RSS culture before its shutdown on July 1, 2013, prompting an exodus to Feedly and similar services.",
  },
  {
    date: "2007-06-01",
    name: "Heroku",
    type: ["Infrastructure", "SaaS", "アメリカ"],
    img: "heroku.svg",
    nationality: "United-States-of-America",
    description:
      "2007年に設立されたクラウドアプリケーションプラットフォーム（PaaS）。2010年にSalesforceが買収。Ruby on Railsをはじめとする開発者の定番として親しまれた。2022年11月28日、無料Dyno・無料Postgres・無料Redisプランを終了し、長年スタートアップやホビープロジェクトを支えてきた無料ティア時代に幕を下ろした。",
    description_en:
      "Cloud application platform (PaaS) founded in 2007 and acquired by Salesforce in 2010. A long-time favorite for Ruby on Rails. On November 28, 2022, Heroku ended its free dyno, free Postgres, and free Redis tiers — closing an era that fueled countless startups and hobby projects.",
  },
  {
    date: "2009-05-28",
    name: "Google Wave",
    type: ["service", "Communication", "アメリカ"],
    img: "googlewave.svg",
    nationality: "United-States-of-America",
    description:
      "Googleが2009年のGoogle I/Oで発表したリアルタイム共同編集ツール。メール・チャット・ドキュメント・Wikiを統合する野心的な構想で大きな話題を呼んだが、ユーザー獲得に失敗し、2010年8月に開発中止が発表され、2012年4月30日に完全終了した。",
    description_en:
      "Real-time collaboration platform announced at Google I/O 2009, ambitiously merging email, chat, docs, and wikis. Failed to gain traction; development halted August 2010 and the service shut down on April 30, 2012.",
  },
  {
    date: "2015-11-01",
    name: "Vercel",
    type: ["Infrastructure", "service", "アメリカ"],
    img: "vercel.svg",
    nationality: "United-States-of-America",
    description:
      "ギジェルモ・ラウシュらが2015年にZeit, Inc.として創業したクラウド/フロントエンド・プラットフォーム。Next.jsをはじめとするフレームワークの開発元としても知られ、2020年4月に社名を「Vercel」へ変更。エッジネットワーク上でのデプロイ体験の標準を作った。",
    description_en:
      "Cloud / frontend platform founded by Guillermo Rauch as Zeit, Inc. in 2015; renamed Vercel in April 2020. Develops Next.js and pioneered the modern edge-deploy developer experience.",
  },
  {
    date: "2016-10-25",
    name: "Next.js",
    type: ["language", "tool", "アメリカ"],
    img: "nextjs.svg",
    nationality: "United-States-of-America",
    description:
      "Vercelが開発するReactベースのフルスタックWebフレームワーク。2016年10月に初版公開。サーバーサイドレンダリング、静的生成、Reactサーバーコンポーネント等をフルスタック開発者に提供し、Reactの事実上の標準ランタイムとなった。",
    description_en:
      "React-based full-stack web framework developed by Vercel. First released October 2016. Combines server-side rendering, static generation, and React Server Components — the de facto runtime for React in production.",
  },

  // ===== 2019-2021 transitional =====
  {
    date: "2019-11-19",
    name: "Stadia",
    type: ["Game", "アメリカ"],
    img: "stadia.svg",
    nationality: "United-States-of-America",
    description:
      "Googleが2019年11月19日に14か国で開始したクラウドゲーミングサービス。専用コントローラーやChromecast上での4K・60fpsストリーミングを売りにしたが、独占タイトルの不足やビジネスモデルの誤算で苦戦し、2023年1月18日にサービス終了。Googleがハードウェア事業の難しさを露呈した象徴的事例。",
    description_en:
      "Cloud gaming service launched by Google on November 19, 2019 in 14 countries, promising 4K/60fps streaming on Chromecast. Hampered by a lack of exclusives and business-model missteps, it shut down on January 18, 2023 — a high-profile cautionary tale for Google's hardware ambitions.",
  },
  {
    date: "2020-05-13",
    name: "Deno",
    type: ["language", "tool", "アメリカ"],
    img: "deno.svg",
    nationality: "United-States-of-America",
    description:
      "Node.js原作者のRyan Dahlが反省点を踏まえて2018年から開発し、2020年5月13日にv1.0をリリースしたJavaScript/TypeScriptランタイム。Web標準API、デフォルトでのセキュアサンドボックス、TypeScriptネイティブサポートを特徴とする。",
    description_en:
      "JavaScript/TypeScript runtime created by Node.js originator Ryan Dahl, addressing his regrets with Node. v1.0 released May 13, 2020. Features web-standard APIs, secure-by-default sandboxing, and native TypeScript support.",
  },
  {
    date: "2020-10-01",
    name: "Stability AI",
    type: ["AI", "イギリス"],
    img: "stabilityai.svg",
    nationality: "United-Kingdom",
    description:
      "エマド・モスタクが2020年に英国で設立したオープンソース志向のAI企業。2022年に画像生成モデル「Stable Diffusion」を公開し、生成AIをオープンソースで一般公開する流れを決定づけた。",
    description_en:
      "UK-based open-source AI company founded by Emad Mostaque in 2020. Released Stable Diffusion in 2022, defining the open-weights path for generative AI.",
  },
  {
    date: "2021-06-29",
    name: "GitHub Copilot",
    type: ["AI", "tool", "アメリカ"],
    img: "githubcopilot.svg",
    nationality: "United-States-of-America",
    description:
      "GitHubとOpenAIが共同開発したAIペアプログラマー。2021年6月29日にテクニカルプレビューを開始し、2022年6月21日に有償版GAを発表。エディタ内での補完を超え、Copilot Workspace、Copilot Chat、エージェント機能へと進化を続けるAIコーディング時代の幕開けとなった。",
    description_en:
      "AI pair programmer co-developed by GitHub and OpenAI. Technical preview launched June 29, 2021; paid GA followed June 21, 2022. Evolved from in-editor completion into Copilot Workspace, Copilot Chat, and agentic coding — kicking off the AI-assisted coding era.",
  },

  // ===== 2022 =====
  {
    date: "2022-04-01",
    name: "ElevenLabs",
    type: ["AI", "Music", "イギリス"],
    img: "elevenlabs.svg",
    nationality: "United-Kingdom",
    description:
      "2022年に元GoogleのPiotr DąbkowskiとMati Staniszewskiがロンドンで創業したAI音声生成スタートアップ。自然なテキスト読み上げ・声質クローニング・多言語ナレーションで音声生成AIのデファクトとなり、ハリウッドやポッドキャスト業界にも採用が広がった。",
    description_en:
      "London-based AI voice startup founded in 2022 by ex-Google engineer Piotr Dąbkowski and Mati Staniszewski. Leads in natural TTS, voice cloning, and multilingual narration — adopted across Hollywood, podcasting, and content production.",
  },
  {
    date: "2022-07-12",
    name: "Midjourney",
    type: ["AI", "Design", "アメリカ"],
    img: "midjourney.svg",
    nationality: "United-States-of-America",
    description:
      "デヴィッド・ホルツが2022年7月12日にオープンベータを開始した画像生成AIサービス。Discord上のコマンド型インターフェースから始まり、ジャーナリズム的な品質の写実画像で生成AIアート文化を決定づけた。",
    description_en:
      "Image-generation AI launched as an open beta on July 12, 2022 by David Holz. Its Discord-based interface and journalistic-quality photorealism shaped early generative-AI art culture.",
  },
  {
    date: "2022-07-20",
    name: "DALL·E 2",
    type: ["AI", "Design", "アメリカ"],
    img: "dalle2.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが開発したテキストから画像を生成するAIモデル。2022年4月に発表、7月20日にパブリックベータを開始した。同じ夏に登場したMidjourneyやStable Diffusionと並び、生成AI画像ブームに火をつけた。",
    description_en:
      "OpenAI's text-to-image model. Announced April 2022, public beta opened July 20, 2022. Together with Midjourney and Stable Diffusion the same summer, ignited the generative-AI image boom.",
  },
  {
    date: "2022-08-22",
    name: "Stable Diffusion",
    type: ["AI", "Design", "イギリス"],
    img: "stablediffusion.svg",
    nationality: "United-Kingdom",
    description:
      "Stability AI、CompVis、Runwayが共同で2022年8月22日にCreativeML OpenRAIL-Mライセンスで公開した拡散モデル系画像生成AI。重みをオープンに公開した最初の主要画像モデルであり、ローカル推論やコミュニティ主導の派生モデル群を生み出した。",
    description_en:
      "Diffusion-based image generator released August 22, 2022 under the CreativeML OpenRAIL-M license by Stability AI, CompVis, and Runway. The first major open-weights image model, enabling local inference and a vast community ecosystem.",
  },
  {
    date: "2022-11-30",
    name: "ChatGPT",
    type: ["AI", "service", "アメリカ"],
    img: "chatgpt.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが2022年11月30日に公開した大規模言語モデル搭載の対話型AIアシスタント。リリース5日で利用者100万人、2か月で1億ユーザーに到達し、史上最速で普及した消費者向けアプリのひとつ。生成AIの一般普及の起点となり、IT業界の構図を一変させた。",
    description_en:
      "Conversational AI assistant launched by OpenAI on November 30, 2022. Hit 1M users in 5 days and 100M in two months — among the fastest-adopted consumer apps in history. Triggered the mainstream generative-AI era and reshaped the tech industry.",
  },
  {
    date: "2022-12-07",
    name: "Perplexity",
    type: ["AI", "search engine", "アメリカ"],
    img: "perplexity.svg",
    nationality: "United-States-of-America",
    description:
      "アラビンド・スリニヴァスらが2022年8月に創業し、12月7日にperplexity.aiを公開したAI検索エンジン。回答に出典リンクを必ず付ける「アンサー・エンジン」スタイルで、Googleに対する世代交代候補として注目された。",
    description_en:
      'AI answer engine founded by Aravind Srinivas et al. (August 2022) and launched on December 7, 2022. Pioneered the citation-first "answer engine" UX, positioning itself as a generational rival to Google search.',
  },

  // ===== 2023 =====
  {
    date: "2023-02-24",
    name: "Llama",
    type: ["AI", "アメリカ"],
    img: "llama.svg",
    nationality: "United-States-of-America",
    description:
      "Meta AIが2023年2月24日に公開した大規模言語モデルファミリー第1世代。研究者向けに重みを限定公開していたが、公開直後に4chanで重みが流出し、結果的にローカルLLMコミュニティの起爆剤となった。",
    description_en:
      "Meta AI's first-generation LLM family, released February 24, 2023 to researchers. Weights leaked on 4chan shortly after, accidentally igniting the local-LLM community.",
  },
  {
    date: "2023-03-01",
    name: "Cursor",
    type: ["AI", "tool", "アメリカ"],
    img: "cursor.svg",
    nationality: "United-States-of-America",
    description:
      "Anysphere社が2023年3月にローンチしたVS CodeベースのAI統合エディタ。LLMをエディタ全体に組み込み、コード補完・チャット・エージェント実行をネイティブ体験として実装。AIファーストIDEというカテゴリを確立した。",
    description_en:
      'VS Code-based AI-native editor launched in March 2023 by Anysphere. Treats LLMs as a first-class part of the editor — completion, chat, and agentic execution — and effectively created the "AI-first IDE" category.',
  },
  {
    date: "2023-03-14",
    name: "GPT-4",
    type: ["AI", "アメリカ"],
    img: "gpt4.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが2023年3月14日にChatGPT PlusおよびAPIで公開した大規模マルチモーダルモデル。司法試験など人間レベルの試験で上位スコアを記録し、生成AIの実用品質を決定的に押し上げた。",
    description_en:
      "Large multimodal model released by OpenAI on March 14, 2023, available via ChatGPT Plus and API. Scored at the human top-tier on benchmarks like the bar exam, marking a decisive jump in generative-AI utility.",
  },
  {
    date: "2023-03-14",
    name: "Claude",
    type: ["AI", "アメリカ"],
    img: "claude.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAI出身のダリオ・アモデイらが創業したAnthropicが、2023年3月14日に限定公開した対話型AI。安全性・有用性・無害性を重視した「Constitutional AI」アプローチで開発され、長文処理と論理的会話に強みを持つ。",
    description_en:
      "Anthropic's conversational AI, first released to limited partners on March 14, 2023. Founded by ex-OpenAI Dario Amodei. Trained with Constitutional AI for helpfulness, harmlessness, and honesty — known for long-context reasoning.",
  },
  {
    date: "2023-03-21",
    name: "Bard",
    type: ["AI", "アメリカ"],
    img: "bard.svg",
    nationality: "United-States-of-America",
    description:
      "Googleが2023年3月21日にUS・UKでウェイトリスト公開した対話型AIアシスタント。当初はLaMDAベース、後にPaLM 2、Geminiへ移行。2024年2月にアプリ名がGeminiへリブランドされ、Bardのブランドは2年弱で幕を閉じた。",
    description_en:
      "Google's conversational AI, opened to a US/UK waitlist on March 21, 2023. Initially LaMDA-based, then PaLM 2, then Gemini. The app was rebranded to Gemini in February 2024, retiring the Bard name after under two years.",
  },
  {
    date: "2023-04-28",
    name: "Mistral AI",
    type: ["AI", "フランス"],
    img: "mistralai.svg",
    nationality: "France",
    description:
      "アルチュル・マンシュ、ギヨーム・ランプル、ティモテ・ラクロワらが2023年4月にパリで創業したAI企業。欧州発のオープンウェイト大規模言語モデルの旗手として、米中AI支配へのカウンターと位置付けられた。",
    description_en:
      "Paris-based AI company founded April 2023 by Arthur Mensch, Guillaume Lample, and Timothée Lacroix. Europe's flagship open-weights LLM lab, positioned as a counterweight to US/China AI dominance.",
  },
  {
    date: "2023-07-05",
    name: "Threads",
    type: ["SNS", "アメリカ"],
    img: "threads.svg",
    nationality: "United-States-of-America",
    description:
      "MetaがInstagramチームを中核に開発し、2023年7月5日に100か国でローンチしたテキスト中心SNS。Twitter/X混乱期に登場し、5日で1億ユーザーを突破して史上最速の立ち上がりを記録。後にActivityPub（Fediverse）対応も進めた。",
    description_en:
      "Text-first social network launched globally by Meta on July 5, 2023, built by the Instagram team. Hit 100M users in 5 days — the fastest launch ever recorded — capitalizing on Twitter/X turmoil. Later adopted ActivityPub for Fediverse interop.",
  },
  {
    date: "2023-07-12",
    name: "xAI",
    type: ["AI", "アメリカ"],
    img: "xai.svg",
    nationality: "United-States-of-America",
    description:
      "イーロン・マスクが2023年7月12日に立ち上げを公表したAI企業。「宇宙の本質を理解する」を掲げる。X（旧Twitter）と密接に連携し、Grokをはじめとするモデルファミリーを開発している。",
    description_en:
      'AI company publicly launched by Elon Musk on July 12, 2023, with the stated mission to "understand the universe". Closely integrated with X (formerly Twitter), it develops the Grok model family.',
  },
  {
    date: "2023-07-17",
    name: "DeepSeek",
    type: ["AI", "中国"],
    img: "deepseek.svg",
    nationality: "China",
    description:
      "梁文鋒（リャン・ウェンフェン）が2023年7月に杭州で設立したAI研究組織。低コストで高性能な大規模言語モデル（V3、R1など）を立て続けに公開し、米中のAI覇権競争を象徴する存在となった。",
    description_en:
      "Hangzhou-based AI lab founded in July 2023 by Liang Wenfeng. Released a cascade of high-performance, low-cost LLMs (V3, R1) that became emblematic of the US–China AI race.",
  },
  {
    date: "2023-07-18",
    name: "Llama 2",
    type: ["AI", "アメリカ"],
    img: "llama2.svg",
    nationality: "United-States-of-America",
    description:
      "Metaが2023年7月18日にMicrosoftと共同で公開した大規模言語モデル第2世代。商用利用可能なライセンスで重みを公開し、ローカル推論・ファインチューニング文化を一気に主流化させた。",
    description_en:
      "Meta's second-generation LLM family, released July 18, 2023 in partnership with Microsoft. Permitted commercial use of the weights, mainstreaming local inference and fine-tuning.",
  },
  {
    date: "2023-09-08",
    name: "Bun",
    type: ["language", "tool", "アメリカ"],
    img: "bun.svg",
    nationality: "United-States-of-America",
    description:
      "Jarred SumnerがOven社で開発し、2023年9月8日に1.0をリリースしたJavaScriptランタイム兼パッケージマネージャ兼バンドラ。Zigで実装され、Node.js互換性と桁違いの起動速度を売りにJSツールチェーンの新潮流となった。",
    description_en:
      "JavaScript runtime, package manager, and bundler hit v1.0 on September 8, 2023. Developed by Jarred Sumner at Oven and implemented in Zig. Pitches Node.js compatibility with order-of-magnitude faster startup.",
  },
  {
    date: "2023-11-04",
    name: "Grok",
    type: ["AI", "アメリカ"],
    img: "grok.svg",
    nationality: "United-States-of-America",
    description:
      "xAIが開発し、2023年11月4日にX Premium加入者向けに早期アクセスを提供した対話型AI。X上のリアルタイム情報を活用する設計と、よりエッジの効いたパーソナリティを売りに、Grok 2/3/4と急速に世代を重ねている。",
    description_en:
      "xAI's conversational AI, opened in early access to X Premium users on November 4, 2023. Designed to leverage X's real-time data with a deliberately edgier persona; rapidly iterated through Grok 2/3/4.",
  },
  {
    date: "2023-12-06",
    name: "Gemini",
    type: ["AI", "アメリカ"],
    img: "gemini.svg",
    nationality: "United-States-of-America",
    description:
      "Google DeepMindが2023年12月6日に発表した大規模マルチモーダルモデルファミリー（Ultra・Pro・Nano）。2024年2月にBardアプリは「Gemini」へリブランドされ、Geminiが同社の生成AIブランドの中核となった。",
    description_en:
      "Multimodal LLM family announced by Google DeepMind on December 6, 2023 (Ultra / Pro / Nano). The Bard app was rebranded to Gemini in February 2024, consolidating Google's generative-AI brand.",
  },
  {
    date: "2023-12-20",
    name: "Suno",
    type: ["AI", "Music", "アメリカ"],
    img: "suno.svg",
    nationality: "United-States-of-America",
    description:
      "ケンブリッジで設立されたSuno, Inc.が2023年12月20日にWebアプリおよびMicrosoft Copilotプラグインとしてステルスを抜けたAI音楽生成サービス。歌詞・歌唱・伴奏を一括生成する機能で「テキストから完全な楽曲を作る」体験を一般化した。",
    description_en:
      "Cambridge-based Suno, Inc. came out of stealth on December 20, 2023 as a web app and Microsoft Copilot plugin. Generates lyrics, vocals, and accompaniment from text — popularizing end-to-end text-to-song.",
  },

  // ===== 2024 =====
  {
    date: "2024-03-04",
    name: "Claude 3",
    type: ["AI", "アメリカ"],
    img: "claude3.svg",
    nationality: "United-States-of-America",
    description:
      "Anthropicが2024年3月4日に公開したClaude第3世代モデルファミリー（Opus・Sonnet・Haiku）。多くのベンチマークでGPT-4を上回り、コーディングや長文読解に強い大規模文脈処理で一気にトップティアの座を獲得した。",
    description_en:
      "Anthropic's third-generation Claude family (Opus / Sonnet / Haiku), released March 4, 2024. Surpassed GPT-4 on many benchmarks, with standout performance in coding and long-context reasoning.",
  },
  {
    date: "2024-04-18",
    name: "Llama 3",
    type: ["AI", "アメリカ"],
    img: "llama3.svg",
    nationality: "United-States-of-America",
    description:
      "Metaが2024年4月18日に公開したLlama第3世代（8B・70B、後に405B）。オープンウェイト陣営の最強候補としてエンタープライズ採用を加速させ、商用LLMとオープンモデルの実力差を一気に縮めた。",
    description_en:
      "Meta's third-generation Llama (8B / 70B; later 405B), released April 18, 2024. The strongest open-weights contender of its day, accelerating enterprise adoption and closing the gap with closed commercial LLMs.",
  },
  {
    date: "2024-12-05",
    name: "OpenAI o1",
    type: ["AI", "アメリカ"],
    img: "openaio1.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが2024年12月5日に正式公開した推論特化モデル。応答前に内部で多段の思考連鎖を実行する「reasoning model」のパラダイムを商用化し、数学・科学・コーディングで大幅な性能向上を示した。",
    description_en:
      'OpenAI\'s reasoning-specialized model, GA on December 5, 2024 (o1-preview was September 12, 2024). Mainstreamed the "reasoning model" paradigm of multi-step internal chain-of-thought, with major gains in math, science, and coding.',
  },
  {
    date: "2024-12-09",
    name: "Sora",
    type: ["AI", "video", "アメリカ"],
    img: "sora.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが2024年2月15日に研究プレビューを発表し、12月9日にChatGPT Plus/Pro加入者向けに一般公開した動画生成AI。テキストから最長1分の高品質動画を生成し、映像制作のワークフローに大きな衝撃を与えた。",
    description_en:
      "OpenAI's video-generation model: research preview announced February 15, 2024, public release for ChatGPT Plus/Pro on December 9, 2024. Generates up to one-minute high-quality videos from text, reshaping creative workflows.",
  },

  // ===== 2025 =====
  {
    date: "2025-04-05",
    name: "Llama 4",
    type: ["AI", "アメリカ"],
    img: "llama4.svg",
    nationality: "United-States-of-America",
    description:
      "Metaが2025年4月5日に公開したLlama第4世代（Scout・Maverick）。ネイティブにマルチモーダル対応した混合エキスパート（MoE）アーキテクチャで、長文処理と効率を両立させた。最大規模のBehemothは引き続き訓練中。",
    description_en:
      "Meta's fourth-generation Llama (Scout, Maverick), released April 5, 2025. Native multimodal mixture-of-experts (MoE) design balancing long context and efficiency. Behemoth, the largest variant, remained in training.",
  },
  {
    date: "2025-04-16",
    name: "OpenAI o3",
    type: ["AI", "アメリカ"],
    img: "openaio3.svg",
    nationality: "United-States-of-America",
    description:
      "OpenAIが2024年12月20日に発表し、2025年4月16日にo4-miniと同時に正式公開した推論モデル。ARC-AGIなど高難度ベンチマークで突出した性能を示し、AGIに近づく道筋として大きな話題を集めた。",
    description_en:
      "OpenAI's reasoning model, announced December 20, 2024 and released alongside o4-mini on April 16, 2025. Posted standout scores on hard benchmarks (e.g. ARC-AGI), drawing major attention as a step toward AGI-class capability.",
  },
  {
    date: "2025-05-22",
    name: "Claude 4",
    type: ["AI", "アメリカ"],
    img: "claude4.svg",
    nationality: "United-States-of-America",
    description:
      "Anthropicが2025年5月22日に公開したClaude第4世代（Opus 4・Sonnet 4）。エージェント的な長時間タスクの安定実行とコーディング能力で評価を確立し、2026年現在もClaude Code等で広く採用されている。",
    description_en:
      "Anthropic's fourth-generation Claude (Opus 4 / Sonnet 4), released May 22, 2025. Set the bar for sustained agentic execution and coding tasks; widely used in 2026 in tools like Claude Code.",
  },
]

let added = 0
let skipped = 0
for (const e of NEW) {
  const era = eraOf(e.date)
  e.type = [...e.type, era]
  if (items.some((i) => i.name === e.name)) {
    skipped++
    continue
  }
  items.push(e)
  added++
}

writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`)
console.log(`✓ Added: ${added}`)
console.log(`✓ Skipped (already present): ${skipped}`)
console.log(`✓ Total entries now: ${items.length}`)

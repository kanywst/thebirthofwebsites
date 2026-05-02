#!/usr/bin/env node
/**
 * Apply post-launch corporate events (acquisitions, rebrands, mergers) to
 * existing info.json entries. Re-runnable: each entry is fully overwritten.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const path = resolve(process.cwd(), "info.json")
const items = JSON.parse(readFileSync(path, "utf8"))

const REBRANDS = {
  Twitter: {
    description:
      "創成期にブログ・サービス「ブロガー」を開発し、その後Googleに売却したエヴァン・ウィリアムズや、ジャック・ドーシー、ビズ・ストーンらが中心となって2006年に開発した。LiveJournalよりリアルタイム性の高い、どこにいても自分の状況を共有・把握できるサービスというドーシーの構想が原点。2022年10月にイーロン・マスクが440億ドルで買収し、2023年7月にサービス名が「X」へとリブランドされた。",
    description_en:
      "Microblogging service launched in 2006 by Evan Williams, Jack Dorsey, and Biz Stone. Acquired by Elon Musk for $44B in October 2022 and rebranded to X in July 2023.",
  },
  Facebook: {
    description:
      "ハーバード大学の学生だったマーク・ザッカーバーグが2004年に立ち上げたソーシャルネットワーキングサービス。2021年10月、親会社のFacebook, Inc.は社名を「Meta Platforms, Inc.」へ変更し、メタバース・AI事業を中核とする方針を打ち出した。Facebookブランド自体はSNS製品名として継続している。",
    description_en:
      "Social networking service founded by Mark Zuckerberg at Harvard in 2004. Parent company Facebook, Inc. rebranded to Meta Platforms, Inc. in October 2021, signaling a strategic pivot to the metaverse and AI. The Facebook brand persists as the SNS product name.",
  },
  "Yahoo!Japan": {
    description:
      "1996年に米Yahoo!とソフトバンクの合弁で設立。日本最大級のポータルサイト・検索エンジンとして長年トップシェアを保ってきた。2010年以降、検索エンジンはGoogleの技術にバックエンドを委ねている。2023年10月、運営元のZホールディングスがLINEと経営統合し「LYコーポレーション」が発足、Yahoo!JAPANはLY傘下のサービスとなった。",
    description_en:
      "Launched in 1996 as a JV between US Yahoo! and SoftBank. Japan's leading portal and search engine for decades; powered by Google's search backend since 2010. In October 2023, parent Z Holdings merged with LINE to form LY Corporation, of which Yahoo!JAPAN is now a subsidiary service.",
  },
  LINE: {
    description:
      "NHN Japan（現LINE株式会社）が東日本大震災の被災者がメッセンジャーで連絡を取り合う様子を契機に開発したメッセージングアプリ。日本・台湾・タイなど東アジア圏で圧倒的シェアを持つ。2023年10月、Yahoo!JAPANを擁するZホールディングスとの経営統合が完了し、運営元は「LYコーポレーション」となった。",
    description_en:
      "Messaging app developed by NHN Japan (now LINE Corporation), inspired by victims of the 2011 Tōhoku earthquake using messengers to reach family. Dominant in Japan, Taiwan, and Thailand. In October 2023 the parent merged with Z Holdings to form LY Corporation.",
  },
  tumblr: {
    description:
      "ブログ、ミニブログ、ソーシャルブックマークを統合したマイクロブログサービス。2007年にDavidville, Inc.がサービスを開始した。2013年にYahoo!が約11億ドルで買収したが、2017年のVerizon傘下を経て、2019年にWordPress.com運営元のAutomatticへ売却された。",
    description_en:
      "Microblogging platform launched in 2007 that combines blogs, miniblogs, and social bookmarks. Acquired by Yahoo! in 2013 for $1.1B; passed to Verizon in 2017; sold to Automattic (WordPress.com) in August 2019.",
  },
  Slack: {
    description:
      "スチュワート・バターフィールドらによって開発されたビジネスチャットツール。ゲーム開発の社内ツールから生まれ、メールに代わるチームコミュニケーションの標準となった。2021年7月、Salesforceが約277億ドルで買収し、現在はSalesforceの一事業として運営されている。",
    description_en:
      "Business messaging tool born from a game studio's internal tool, founded by Stewart Butterfield. Became a de facto standard for team communication. Acquired by Salesforce in July 2021 for $27.7B.",
  },
  Pornhub: {
    description:
      "カナダ発のポルノ動画共有サイト。世界最大級の動画共有サービスのひとつ。長年MindGeekに所有されていたが、2023年3月にカナダの投資会社Ethical Capital Partnersが買収し、運営会社は「Aylo（アイロ）」へリブランドされた。",
    description_en:
      "Canadian pornographic video sharing platform; among the largest of its kind globally. Long owned by MindGeek, the parent company was acquired by Ethical Capital Partners in March 2023 and rebranded to Aylo.",
  },
  RedTube: {
    description:
      "RedTube（レッドチューブ）は、アダルト動画共有サービス。Pornhub、YouPornとともに長年MindGeekが運営していたが、2023年3月にEthical Capital Partnersへ売却され、運営会社は「Aylo」へリブランドされた。",
    description_en:
      "Adult video sharing service. Operated alongside Pornhub and YouPorn under MindGeek; sold in March 2023 to Ethical Capital Partners, with the parent rebranded to Aylo.",
  },
  YouPorn: {
    description:
      "2006年8月公開のアダルト動画共有サービス。同時期に登場したPornoTubeを早期に追い抜いて人気サイトとなった。Pornhub・RedTubeと共にMindGeekが運営していたが、2023年3月にEthical Capital Partnersへ売却、運営会社は「Aylo」へリブランドされた。",
    description_en:
      "Adult video sharing service launched August 2006, quickly overtaking the contemporaneous PornoTube. Operated alongside Pornhub and RedTube under MindGeek; sold to Ethical Capital Partners in March 2023, with the parent rebranded to Aylo.",
  },
  Yahoo: {
    description:
      "1994年にスタンフォード大学のジェリー・ヤンとデビッド・ファイロがウェブディレクトリとして開始。GoogleやFacebookとの競争で主力事業の競争力が低下し、2017年にコア事業がVerizonに44.8億ドルで売却され「Oath（後のVerizon Media）」となった。2021年5月、Verizon Mediaは投資会社Apollo Global Managementへ売却され、現在は再び「Yahoo Inc.」として独立運営されている。",
    description_en:
      "Founded in 1994 by Jerry Yang and David Filo as a web directory. After losing ground to Google and Facebook, the core internet business was sold to Verizon in 2017 for $4.48B (becoming Oath, then Verizon Media). In May 2021, Apollo Global Management acquired the unit, which now operates as the standalone Yahoo Inc.",
  },
  Heroku: {
    description:
      "2007年に設立されたクラウドアプリケーションプラットフォーム（PaaS）。2010年にSalesforceが買収。Ruby on RailsをはじめとするWeb開発者の定番として親しまれた。2022年11月28日、無料Dyno・無料Postgres・無料Redisプランを終了し、長年スタートアップやホビープロジェクトを支えてきた無料ティアの時代に幕を下ろした。",
    description_en:
      "Cloud application platform (PaaS) founded in 2007 and acquired by Salesforce in 2010. A long-time favorite for Ruby on Rails and indie developers. On November 28, 2022, Heroku ended its free dyno, free Postgres, and free Redis tiers — closing an era that had fueled countless startups and hobby projects.",
  },
  Skype: {
    description:
      "ニコラス・センストロムとヤヌス・フリスが2003年に設立したP2P電話サービス。スマートフォン以前の国際通話の常識を変えた。2011年5月、Microsoftが85億ドルで買収。長らくMicrosoftのコミュニケーション基盤として使われてきたが、2025年5月5日にコンシューマー版サービスを終了し、ユーザーはMicrosoft Teams（無料版）へ移行した。",
    description_en:
      "P2P calling service founded in 2003 by Niklas Zennström and Janus Friis, transforming international phone calls before the smartphone era. Acquired by Microsoft for $8.5B in May 2011. The consumer service shut down on May 5, 2025, with users migrated to the free tier of Microsoft Teams.",
  },
  LiveLeak: {
    description:
      "戦争・テロ・犯罪・事故・災害といった現実の出来事を生のまま配信するニュース／ショックサイトの代表格。2006年に競合のOgrish.comを統合し、市民ジャーナリズムと「グロサイト」の中間を占めた。2021年5月5日にサービスを終了し、ItemFix.comへリダイレクトされた。",
    description_en:
      "News / shock site that distributed raw footage of wars, terrorism, crimes, accidents, and disasters. Absorbed competitor Ogrish.com in 2006, occupying a contested space between citizen journalism and outright shock content. Shut down on May 5, 2021 and redirected to ItemFix.com.",
  },
  Vimeo: {
    description:
      "プロ・セミプロのクリエイターに支持されてきた動画共有プラットフォーム。2017年9月にライブ配信会社Livestreamを買収。2021年5月にIACからスピンオフしてニューヨーク証券取引所に上場（VMEO）。2025年9月10日、伊Bending Spoonsが約13.8億ドルで全株を取得し、再び非上場化することが発表された。",
    description_en:
      "Video sharing platform favored by professional and semi-pro creators. Acquired live-streaming firm Livestream in September 2017. Spun off from IAC and listed on NYSE (VMEO) in May 2021. On September 10, 2025, Italy's Bending Spoons announced a $1.38B all-cash deal to take Vimeo private.",
  },
  Yandex: {
    description:
      "1997年に公開されたロシア最大の検索エンジン。タクシー配車、自動運転、広告、AI開発まで手がけるロシア最大級のテック企業として成長した。2024年7月、欧米の制裁を背景にYandex N.V.は約54億ドルでロシア事業を分離売却。残された海外資産は「Nebius Group」（オランダ拠点）へ社名変更し、ロシア国内のYandexは国内コンソーシアムが運営する別法人となった。",
    description_en:
      "Search engine launched in Russia in 1997, growing into one of the country's largest tech companies (search, ride-hailing, autonomous driving, ads, AI). In July 2024, under Western sanctions, Yandex N.V. divested its Russian operations for ~$5.4B; the remaining international entity rebranded as Netherlands-based Nebius Group, while the domestic Yandex was spun off to a Russian consortium.",
  },
  "Red Hat": {
    description:
      "1993年に設立されたLinuxディストリビューション企業。商用Linux市場のデファクトスタンダードであるRed Hat Enterprise Linux（RHEL）を中核に、JBoss、OpenShift等のミドルウェア／PaaSへ事業を拡大。2019年7月9日、IBMが約340億ドルでRed Hatの買収を完了した。Red Hatブランドと独立した運営は維持されつつ、IBMのハイブリッドクラウド戦略の中核に位置付けられている。",
    description_en:
      "Linux distribution company founded in 1993, anchoring the commercial Linux market with Red Hat Enterprise Linux (RHEL) and expanding into middleware and PaaS via JBoss and OpenShift. IBM closed its acquisition for ~$34B on July 9, 2019; Red Hat continues to operate as a distinct unit and brand, anchoring IBM's hybrid-cloud strategy.",
  },
  VMware: {
    description:
      "1998年に設立された仮想化ソフトウェアの先駆者。x86サーバ仮想化の事実上の標準として、データセンターからクラウドまで企業ITの基盤を担ってきた。2023年11月22日、半導体大手Broadcomが約690億ドルでVMwareの買収を完了。買収後はライセンス体系のサブスクリプション化や非中核事業の売却など、大規模な再編が進められた。",
    description_en:
      "Pioneer of virtualization software founded in 1998. The de facto standard for x86 server virtualization, underpinning enterprise IT from the data center to the cloud. Broadcom closed its acquisition for ~$69B on November 22, 2023, then rapidly moved to subscription licensing and non-core divestments.",
  },
  Hulu: {
    description:
      "2007年にNBCユニバーサルとフォックスの合弁で設立された米国の動画配信サービス。2019年にDisneyが運営権を取得し、2023年11月にコムキャストが保有していた残り33%の株式を取得して完全子会社化。2024年以降、Disney+との統合が進み、Disneyのストリーミング戦略の一翼を担っている。",
    description_en:
      "US video streaming service founded in 2007 as a joint venture between NBCUniversal and Fox. Disney took operational control in 2019 and acquired Comcast's remaining 33% stake in November 2023, making Hulu a wholly-owned subsidiary. Since 2024 the service has been progressively integrated with Disney+.",
  },
  Netscape: {
    description:
      "1994年にマーク・アンドリーセンとジム・クラークが設立。同年公開のWebブラウザ「Netscape Navigator」でインターネット初期の爆発的普及を牽引したが、Microsoftの「Internet Explorer」に押されて1990年代後半の「ブラウザ戦争」に敗れた。1999年にAOLが買収し、2008年にブランドは終了。オープンソース化されたコードはMozillaプロジェクトの母体となった。",
    description_en:
      "Founded in 1994 by Marc Andreessen and Jim Clark. Released Netscape Navigator the same year and drove the explosive early growth of the consumer Web, but lost the late-1990s 'browser wars' to Microsoft's Internet Explorer. Acquired by AOL in 1999; the brand was retired in 2008. Its open-sourced codebase became the foundation of the Mozilla project.",
  },
}

let updated = 0
for (const item of items) {
  const patch = REBRANDS[item.name]
  if (patch) {
    Object.assign(item, patch)
    updated++
  }
}

writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`)
console.log(`✓ Rebrand patches applied: ${updated}/${Object.keys(REBRANDS).length}`)

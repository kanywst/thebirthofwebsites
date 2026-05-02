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

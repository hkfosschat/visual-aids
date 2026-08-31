export const meta = {
  title: 'Condorcet Voting',
  description: 'The Debian voting system',
  tags: ['Debian', 'voting'],
};

import React, { useState, useMemo } from 'react';

// Dictionary containing English and Traditional Chinese (Hong Kong) text
const TRANSLATIONS = {
  en: {
    title: 'Condorcet Voting Method',
    subtitle: 'Explore why pairwise voting works better and how tie-breaking algorithms resolve cycles.',
    langBtn: '繁體中文',
    mainTabWhy: '1. Why Condorcet? (3 Problems Illustrated)',
    mainTabTies: '2. Tie-Breaking Algorithms',
    p1SubTab: 'Problem 1: Eliminates Spoilers',
    p2SubTab: 'Problem 2: Rewards Broad Consensus',
    p3SubTab: 'Problem 3: Honest Preferences',
    tieSubSchulze: 'Schulze Method (Path Strengths)',
    tieSubRP: 'Ranked Pairs (Tideman)',
    tieSubCopeland: "Copeland's Method",

    // Confusion & Inner Workings Labels
    howItWorksTitle: '🔍 How Condorcet Works Internally (Inner Workings)',
    confusionTitle: '❓ Why Plurality Voters Get Confused',
    confusionP1: 'In Plurality, only 1st choices count. In Condorcet, every ballot is broken down into 1-on-1 duels between all candidate pairs.',
    pairwiseMatrixTitle: 'Pairwise Head-to-Head Matrix',
    voterBreakdownTitle: 'Voter Preference Group Breakdown',
    headToHeadDuels: 'Head-to-Head Duel Breakdown (1-on-1 Direct Matchups)',
    vs: 'vs',
    winsOver: 'defeats',

    // Problem 1
    p1Title: 'Scenario: The Vote-Splitting Spoiler Effect',
    p1Desc: 'In Plurality Voting, two similar Blue candidates (A1 & A2) split the majority vote, allowing Black B to win despite 55% of voters preferring a Blue team member.',
    blueA1Label: 'Blue A1 (A1 > A2 > B):',
    blueA2Label: 'Blue A2 (A2 > A1 > B) [Spoiler]:',
    blackBLabel: 'Black B (B > A1 > A2):',
    pluralityTitle: 'Plurality Voting',
    condorcetTitle: 'Condorcet Method',
    p1PluralityWinB: 'Wins with {w1B}% plurality because Blue A1 ({w1A1}%) and Blue A2 ({w1A2}%) split votes.',
    p1PluralityWinA1: 'Blue team united enough to overcome Black B ({w1B}%).',
    p1PluralityWinA2: 'Blue team united enough to overcome Black B ({w1B}%).',
    p1CondorcetB: 'Black B defeats both in direct duels ({w1B}% vs {progTotal}%).',
    p1CondorcetProg: 'Blue team beats Black B ({progTotal}% vs {w1B}%) in direct duels because Blue A2 voters transfer their 2nd preference to Blue A1!',

    // Problem 2
    p2Title: 'Scenario: Polarizing Extremes vs. Moderate Consensus Candidate',
    p2Desc: 'Plurality awards victory to Hard Left because it has a passionate base, even though 60% of voters prefer a non-extreme candidate. Condorcet selects Moderate Center, who wins every 1-on-1 matchup.',
    hardLeftLabel: 'Hard Left (Hard Left > Moderate > Hard Right):',
    moderateLabel: 'Moderate Center (Moderate > Hard Right > Hard Left):',
    hardRightLabel: 'Hard Right (Hard Right > Moderate > Hard Left):',
    p2PluralityDesc: 'Wins with {w2X}% 1st-choice votes despite 60% ranking Hard Left last.',
    p2CondorcetDesc: 'Moderate beats Hard Left ({yVsX}% vs {w2X}%) AND Moderate beats Hard Right ({yVsZ}% vs {w2Z}%) in direct matchups!',
    p2CondorcetFailDesc: 'Extremes outweighed moderate preferences.',
    p2ConfusionText: 'Moderate Center only gets 25% of #1 votes, making Plurality voters think Moderate "lost". But Moderate is the #2 choice for both Left and Right voters, giving Moderate a clear majority in every direct duel!',

    // Problem 3
    p3Title: 'Scenario: Strategic vs. Honest Preferences',
    p3Desc: 'Why do Plurality voters feel forced to vote strategically? Under Plurality, voting honestly for your favorite minor candidate "wastes" your vote and lets your worst outcome win. Under Condorcet, your #2 preference actively defends against your #3 preference.',
    p3ConfusionTitle: '🧠 Why Voters Get Confused & How Strategy Works',
    p3ConfusionText: 'In Plurality, voters fear "wasting" their vote on Green M (5%), which lets Orange R (48%) defeat Cyan S (47%). Plurality forces Green M voters to strategically lie and vote Cyan S #1. Under Condorcet, ranking M #1 DOES NOT harm S, because S still gets your vote when pitted against R!',
    strategyLabel: 'Your Preference Strategy:',
    optHonest: 'Honest Ballot: Rank M #1, S #2, R #3',
    optTactical: 'Tactical Ballot: Compromise & Vote S #1 directly (Bury M)',
    p3PluralityWinHonest: 'Orange R Wins! (Worst Outcome)',
    p3PluralityWinTactical: 'Cyan S Wins (Forced Betrayal)',
    p3PluralityDescHonest: 'Your 1st-choice vote went to Green M (5%). Cyan S loses to Orange R (47 vs 48). Honest voting failed you!',
    p3PluralityDescTactical: 'You were forced to lie and vote S #1 directly to block R. Green M got 0% support despite being preferred.',
    p3CondorcetWin: 'Cyan S Wins! (Ideal Outcome)',
    p3CondorcetDescHonest: 'You ranked M #1 and S #2. In S vs R, your ballot fully supports S (52 vs 48). Honest voting worked perfectly!',
    p3CondorcetDescTactical: "Strategic lying is pointless—Condorcet yields the exact same winner (Cyan S) even when voting 100% honestly.",

    // Ties Section
    tieTitle: 'Condorcet Cycle Resolution',
    tieDesc: 'When preferences form a loop (A beats B, B beats C, C beats A), no pure Condorcet Winner exists. Select an algorithm below to see step-by-step how ties are broken:',
    marginsHeader: 'Simulated Cycle Head-to-Head Victory Margins:',
    aBeatsB: 'A defeats B by:',
    bBeatsC: 'B defeats C by:',
    cBeatsA: 'C defeats A by:',

    // Schulze
    schulzeWinnerTitle: 'Schulze Method Winner',
    schulzeWinnerDesc: 'Elects candidate with the strongest path across the pairwise graph.',
    schulzeStep1Title: 'Step 1: Identify Direct Matchup Strengths',
    schulzeStep2Title: 'Step 2: Calculate Strongest Paths',
    schulzeStep3Title: 'Step 3: Drop Weakest Link & Compare',
    schulzeStep3Desc: 'The link with margin (+{minMargin}) is the weakest link in the cycle and is dropped. {schulzeWinner} retains the path of maximum strength!',

    // Ranked Pairs
    rpWinnerTitle: 'Ranked Pairs Winner',
    rpWinnerDesc: 'Locks in majorities in order of margin size, skipping links that create cycles.',
    rpStep1Title: 'Step 1: Sort Victories by Margin',
    rpStep2Title: 'Step 2: Lock Majorities (Tideman Graph)',
    rpStep2Lock: 'Lock:',
    rpStep2Discard: 'Discard:',
    rpStep2CycleNote: '(Skipped because it creates a cycle)',
    rpStep3Title: 'Step 3: Final Order',
    rpStep3Desc: 'Locked graph hierarchy: Candidate {first} → Candidate {second} → Candidate {third}. Winner is Candidate {first}.',

    // Copeland
    copelandWinnerTitle: "Copeland's Method Winner",
    copelandTie: '3-Way Tie (1.0 pt each)',
    copelandWinnerDesc: 'Assigns 1 point per win, 0.5 for ties, 0 for loss.',
    thCandidate: 'Candidate',
    thWins: 'Wins',
    thLosses: 'Losses',
    thScore: 'Copeland Score',
    copelandNoteTitle: 'Tie-Breaker Rule for Copeland',
    copelandNoteDesc: 'Because Copeland only counts win/loss status (+1 / 0) without considering victory margins, circular ties always yield identical scores (1.0 each).',

    // Candidates
    candBlueA1: 'Blue A1',
    candBlueA2: 'Blue A2',
    candBlackB: 'Black B',
    candHardLeft: 'Hard Left',
    candModerate: 'Moderate Center',
    candHardRight: 'Hard Right',
    candGreenM: 'Green M',
    candCyanS: 'Cyan S',
    candOrangeR: 'Orange R',
    candPolarizing: 'Polarizing Candidate',
  },
  zh: {
    title: '孔多塞投票法 (Condorcet Voting Method)',
    subtitle: '探索兩兩對決投票 (Pairwise Voting) 的優勢，以及決同分演算法 (Tie-Breaking Algorithms) 如何破解投票循環。',
    langBtn: 'English',
    mainTabWhy: '1. 為什麼選擇孔多塞？（三個經典情境）',
    mainTabTies: '2. 決同分演算法 (Tie-Breaking Algorithms)',
    p1SubTab: '問題 1：消除分票效應 (Spoiler Effect)',
    p2SubTab: '問題 2：獎勵廣泛共識 (Broad Consensus)',
    p3SubTab: '問題 3：鼓勵真實偏好 (Honest Preferences)',
    tieSubSchulze: '舒爾茨法 (Schulze Method)',
    tieSubRP: '排序對分法 / 蒂德曼法 (Ranked Pairs / Tideman)',
    tieSubCopeland: '科普蘭法 (Copeland\'s Method)',

    // Confusion & Inner Workings Labels
    howItWorksTitle: '🔍 孔多塞法的內部運作機制 (Inner Workings)',
    confusionTitle: '❓ 為什麼習慣傳統投票的人會感到困惑？',
    confusionP1: '傳統單記名投票（Plurality）只計算「第一志願」。孔多塞法（Condorcet）則會將每張選票拆解，讓所有候選人進行 1 對 1 兩兩對決（Pairwise Duels）。',
    pairwiseMatrixTitle: '兩兩對決勝負矩陣表 (Pairwise Head-to-Head Matrix)',
    voterBreakdownTitle: '選民偏好組別票數分布 (Voter Preference Breakdown)',
    headToHeadDuels: '1 對 1 直接對決數據拆解 (Head-to-Head Duels)',
    vs: '對決',
    winsOver: '勝出',

    // Problem 1
    p1Title: '情境：分票效應 (Vote-Splitting Spoiler Effect)',
    p1Desc: '在傳統單記名投票中，兩位同屬藍隊的候選人 (A1 與 A2) 瓜分了多數票源，導致黑隊 B 在 55% 選民偏好藍隊的情況下依然勝出。',
    blueA1Label: '藍隊 A1 (A1 > A2 > B):',
    blueA2Label: '藍隊 A2 (A2 > A1 > B) [分票者]:',
    blackBLabel: '黑隊 B (B > A1 > A2):',
    pluralityTitle: '單記名投票 (Plurality Voting)',
    condorcetTitle: '孔多塞投票法 (Condorcet Method)',
    p1PluralityWinB: '以 {w1B}% 簡單多數勝出，因藍隊 A1 ({w1A1}%) 與藍隊 A2 ({w1A2}%) 互相分散了票源。',
    p1PluralityWinA1: '藍隊票源足夠集中，擊敗了黑隊 B ({w1B}%)。',
    p1PluralityWinA2: '藍隊票源足夠集中，擊敗了黑隊 B ({w1B}%)。',
    p1CondorcetB: '黑隊 B 在 1 對 1 對決中擊敗所有對手 ({w1B}% vs {progTotal}%)。',
    p1CondorcetProg: '藍隊在 1 對 1 對決中擊敗黑隊 B ({progTotal}% vs {w1B}%)，因為支持 A2 的選民在 A1 對決 B 時，第二志願全數轉移支持 A1！',

    // Problem 2
    p2Title: '情境：極端派 vs. 中立共識候選人 (Broad Consensus Candidate)',
    p2Desc: '單記名投票將勝利頒給擁有狂熱基本盤的極左派，即使有 60% 的選民排斥極端立場。孔多塞投票法則選出在每一次 1 對 1 對決中皆獲勝的中立溫和派。',
    hardLeftLabel: '極左派 (極左 > 中立 > 極右):',
    moderateLabel: '中立溫和派 (中立 > 極右 > 極左):',
    hardRightLabel: '極右派 (極右 > 中立 > 極左):',
    p2PluralityDesc: '憑藉 {w2X}% 的第一志願票勝出，儘管有 60% 選民將極左派排在最後一名。',
    p2CondorcetDesc: '中立派在直接對決中同時擊敗極左派 ({yVsX}% vs {w2X}%) 及極右派 ({yVsZ}% vs {w2Z}%)！',
    p2CondorcetFailDesc: '兩極化的極端選民壓倒了中立候選人。',
    p2ConfusionText: '中立溫和派的「第一志願票」只有 25%，傳統選民會誤以為中立派輸了。但中立派是極左與極右選民共同的「第二志願」，因此在任何 1 對 1 對決中，中立派都能跨越陣營獲得過半數支持！',

    // Problem 3
    p3Title: '情境：策略性投票 vs. 真實偏好 (Strategic vs. Honest Preferences)',
    p3Desc: '為什麼單記名投票會逼選民「違心棄保」？在單記名下，投給小眾首選 (M) 會形成廢票並讓最討厭的人 (R) 當選；但在孔多塞投票下，您的第二志願 (S) 能在對決中獲得全額支持，因此「真實表態」安全又有效。',
    p3ConfusionTitle: '🧠 策略性投票的盲點與認知困惑分析',
    p3ConfusionText: '在單記名投票中，選民害怕把票「浪費」在綠隊 M (5%) 上，導致橙隊 R (48%) 擊敗青隊 S (47%)。因此選民被迫「策略性說謊」，直接投給 S。但在孔多塞法中，把 M 排第一完全不會損害 S，因為在 S 對決 R 時，您的選票仍會 100% 算給 S！',
    strategyLabel: '您的投票策略 (Preference Strategy):',
    optHonest: '真實選票 (Honest Ballot): 排序 M #1, S #2, R #3',
    optTactical: '策略選票 (Tactical Ballot): 棄保說謊，直接改投 S #1 (掩埋 M)',
    p3PluralityWinHonest: '橙隊 R 勝出！(最差結果)',
    p3PluralityWinTactical: '青隊 S 勝出 (被迫棄保)',
    p3PluralityDescHonest: '您的首選給了綠隊 M (5%)，致使青隊 S 以 47 比 48 輸給橙隊 R。表達真實偏好慘遭懲罰！',
    p3PluralityDescTactical: '您被迫違心棄保，直接投 S 以阻止 R 勝出。綠隊 M 的真實支持率被歸零。',
    p3CondorcetWin: '青隊 S 勝出！(理想結果)',
    p3CondorcetDescHonest: '您將 M 排在 #1、S 排在 #2。在 S 對決 R 時，您的選票全數轉移支持 S (52 vs 48)。真實表態完美成功！',
    p3CondorcetDescTactical: '策略性說謊完全是多餘的——即使 100% 真實表態，孔多塞法也能得出完全相同的勝者 (青隊 S)。',

    // Ties Section
    tieTitle: '孔多塞循環決同 (Condorcet Cycle Resolution)',
    tieDesc: '當偏好形成循環 (A 勝 B，B 勝 C，C 勝 A) 時，系統中不存在純粹的孔多塞勝者 (Condorcet Winner)。請選擇下方演算法，查看逐步解開循環的過程：',
    marginsHeader: '模擬循環兩兩對決 (Pairwise Head-to-Head) 勝出票差：',
    aBeatsB: 'A 擊敗 B 票差:',
    bBeatsC: 'B 擊敗 C 票差:',
    cBeatsA: 'C 擊敗 A 票差:',

    // Schulze
    schulzeWinnerTitle: '舒爾茨法勝者 (Schulze Method Winner)',
    schulzeWinnerDesc: '選出在兩兩對決導向圖中擁有最強優先路徑 (Strongest Path) 的候選人。',
    schulzeStep1Title: '步驟 1：計算直接對決強度 (Direct Matchup Margins)',
    schulzeStep2Title: '步驟 2：計算最強優先路徑 (Strongest Paths)',
    schulzeStep3Title: '步驟 3：移除最弱環節 (Drop Weakest Link)',
    schulzeStep3Desc: '票差為 (+{minMargin}) 的邊是循環中最弱的環節，故被剔除。{schulzeWinner} 保留了強度最大的路徑！',

    // Ranked Pairs
    rpWinnerTitle: '排序對分法勝者 (Ranked Pairs Winner)',
    rpWinnerDesc: '按勝出票差由大至小依次鎖定對決結果，並跳過會引致循環 (Cycle) 的邊。',
    rpStep1Title: '步驟 1：按勝出票差排序 (Sort Victories by Margin)',
    rpStep2Title: '步驟 2：鎖定多數邊 (Lock Majorities / Tideman Graph 蒂德曼圖)',
    rpStep2Lock: '鎖定 (Lock):',
    rpStep2Discard: '捨棄 (Discard):',
    rpStep2CycleNote: '(因會構成循環而跳過 / Skipped because it creates a cycle)',
    rpStep3Title: '步驟 3：確定最終層級 (Final Order)',
    rpStep3Desc: '鎖定後的有向無環圖層級：候選人 {first} → 候選人 {second} → 候選人 {third}。最終勝者為候選人 {first}。',

    // Copeland
    copelandWinnerTitle: '科普蘭法勝者 (Copeland\'s Method Winner)',
    copelandTie: '三方平手 (3-Way Tie - 各得 1.0 分)',
    copelandWinnerDesc: '勝出一場得 1 分，平手得 0.5 分，敗北得 0 分。',
    thCandidate: '候選人 (Candidate)',
    thWins: '勝 (Wins)',
    thLosses: '負 (Losses)',
    thScore: '科普蘭得分 (Copeland Score)',
    copelandNoteTitle: '科普蘭法之決同規則 (Tie-Breaker Rule)',
    copelandNoteDesc: '由於科普蘭法只計算勝負狀態 (+1 / 0) 而忽略勝出票差 (Victory Margins)，循環同分時總會得到相同的分數 (各 1.0 分)。',

    // Candidates
    candBlueA1: '藍隊 A1 (Blue A1)',
    candBlueA2: '藍隊 A2 (Blue A2)',
    candBlackB: '黑隊 B (Black B)',
    candHardLeft: '極左派 (Hard Left)',
    candModerate: '中立溫和派 (Moderate Center)',
    candHardRight: '極右派 (Hard Right)',
    candGreenM: '綠隊 M (Green M)',
    candCyanS: '青隊 S (Cyan S)',
    candOrangeR: '橙隊 R (Orange R)',
    candPolarizing: '極端候選人 (Polarizing Candidate)',
  }
};

export default function CondorcetInteractiveSuite() {
  const [lang, setLang] = useState('zh');
  const t = TRANSLATIONS[lang];

  // Navigation State
  const [mainTab, setMainTab] = useState('why');
  const [whySubTab, setWhySubTab] = useState(1);
  const [tieSubTab, setTieSubTab] = useState(1);

  // Problem 1 State (Spoiler Effect)
  const [w1A1, setW1A1] = useState(30); // Blue A1
  const [w1A2, setW1A2] = useState(25); // Blue A2 (Spoiler)
  const [w1B, setW1B] = useState(45);   // Black B

  // Problem 2 State (Broad Consensus - Hard Left / Moderate / Hard Right)
  const [w2X, setW2X] = useState(40); // Hard Left
  const [w2Y, setW2Y] = useState(25); // Moderate Center
  const [w2Z, setW2Z] = useState(35); // Hard Right

  // Problem 3 State (Honest Preferences)
  const [w3Strategy, setW3Strategy] = useState('honest');

  // Tie-Breaker Margins State
  const [mAb, setMAb] = useState(20);
  const [mBc, setMBc] = useState(35);
  const [mCa, setMCa] = useState(5);

  // --- Calculations ---

  // Problem 1 Derived Calculations
  const why1Results = useMemo(() => {
    let pluralityWinner = t.candBlackB;
    let pluralityDesc = t.p1PluralityWinB.replace('{w1B}', w1B).replace('{w1A1}', w1A1).replace('{w1A2}', w1A2);

    if (w1A1 > w1B && w1A1 >= w1A2) {
      pluralityWinner = t.candBlueA1;
      pluralityDesc = t.p1PluralityWinA1.replace('{w1B}', w1B);
    } else if (w1A2 > w1B && w1A2 > w1A1) {
      pluralityWinner = t.candBlueA2;
      pluralityDesc = t.p1PluralityWinA2.replace('{w1B}', w1B);
    }

    const progTotal = w1A1 + w1A2;
    let condorcetWinner = t.candBlackB;
    let condorcetDesc = t.p1CondorcetB.replace('{w1B}', w1B).replace('{progTotal}', progTotal);

    if (progTotal > w1B) {
      condorcetWinner = w1A1 >= w1A2 ? t.candBlueA1 : t.candBlueA2;
      condorcetDesc = t.p1CondorcetProg.replace('{progTotal}', progTotal).replace('{w1B}', w1B);
    }

    const a1VsA2 = w1A1 + w1B;
    const a2VsA1 = w1A2;

    const a1VsB = w1A1 + w1A2;
    const bVsA1 = w1B;

    const a2VsB = w1A2 + w1A1;
    const bVsA2 = w1B;

    return { pluralityWinner, pluralityDesc, condorcetWinner, condorcetDesc, progTotal, a1VsA2, a2VsA1, a1VsB, bVsA1, a2VsB, bVsA2 };
  }, [w1A1, w1A2, w1B, t]);

  // Problem 2 Derived Calculations (Left / Moderate / Right)
  const why2Results = useMemo(() => {
    let pluralityWinner = t.candHardLeft;
    if (w2Y > w2X && w2Y > w2Z) pluralityWinner = t.candModerate;
    if (w2Z > w2X && w2Z > w2Y) pluralityWinner = t.candHardRight;

    const yVsX = w2Y + w2Z;
    const xVsY = w2X;

    const yVsZ = w2Y + w2X;
    const zVsY = w2Z;

    const zVsX = w2Z + w2Y;
    const xVsZ = w2X;

    let condorcetWinner = t.candPolarizing;
    let condorcetDesc = t.p2CondorcetFailDesc;

    if (yVsX > xVsY && yVsZ > zVsY) {
      condorcetWinner = t.candModerate;
      condorcetDesc = t.p2CondorcetDesc.replace('{yVsX}', yVsX).replace('{w2X}', w2X).replace('{yVsZ}', yVsZ).replace('{w2Z}', w2Z);
    }

    return { pluralityWinner, condorcetWinner, condorcetDesc, xVsY, yVsX, yVsZ, zVsY, xVsZ, zVsX };
  }, [w2X, w2Y, w2Z, t]);

  // Problem 3 Derived Calculations
  const why3Results = useMemo(() => {
    const mGroup = 5;
    const sGroup = 47;
    const rGroup = 48;

    let effectiveM = mGroup;
    let effectiveS = sGroup;

    if (w3Strategy === 'tactical') {
      effectiveM = 0;
      effectiveS = sGroup + mGroup;
    }

    const sVsR = mGroup + sGroup; // 52
    const rVsS = rGroup;          // 48

    const mVsS = mGroup;          // 5
    const sVsM = sGroup + rGroup; // 95

    return { effectiveM, effectiveS, rGroup, sVsR, rVsS, mVsS, sVsM, mGroup, sGroup };
  }, [w3Strategy]);

  // Tie Breaker Calculations
  const tieResults = useMemo(() => {
    const minMargin = Math.min(mAb, mBc, mCa);
    let schulzeWinnerKey = 'B';
    if (minMargin === mAb) schulzeWinnerKey = 'C';
    if (minMargin === mBc) schulzeWinnerKey = 'A';
    if (minMargin === mCa) schulzeWinnerKey = 'B';

    const schulzeWinner = `${lang === 'zh' ? '候選人' : 'Candidate'} ${schulzeWinnerKey}`;

    const pairs = [
      { winner: 'A', loser: 'B', margin: mAb },
      { winner: 'B', loser: 'C', margin: mBc },
      { winner: 'C', loser: 'A', margin: mCa },
    ].sort((a, b) => b.margin - a.margin);

    const first = pairs[0];
    const second = pairs[1];
    const third = pairs[2];
    const rpWinner = `${lang === 'zh' ? '候選人' : 'Candidate'} ${first.winner}`;

    return { minMargin, schulzeWinner, pairs, first, second, third, rpWinner };
  }, [mAb, mBc, mCa, lang]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.langToggleRow}>
          <button
            style={styles.langToggleBtn}
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            title="Switch Language / 切換語言"
          >
            🌐 {t.langBtn}
          </button>
        </div>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
      </header>

      {/* Main Navigation Tabs */}
      <div style={styles.navTabs}>
        <button
          style={{ ...styles.tabBtn, ...(mainTab === 'why' ? styles.tabBtnActive : {}) }}
          onClick={() => setMainTab('why')}
        >
          {t.mainTabWhy}
        </button>
        <button
          style={{ ...styles.tabBtn, ...(mainTab === 'ties' ? styles.tabBtnActive : {}) }}
          onClick={() => setMainTab('ties')}
        >
          {t.mainTabTies}
        </button>
      </div>

      {/* SECTION 1: WHY CONDORCET? */}
      {mainTab === 'why' && (
        <div style={styles.card}>
          <div style={styles.subTabs}>
            <button
              style={{ ...styles.subBtn, ...(whySubTab === 1 ? styles.subBtnActive : {}) }}
              onClick={() => setWhySubTab(1)}
            >
              {t.p1SubTab}
            </button>
            <button
              style={{ ...styles.subBtn, ...(whySubTab === 2 ? styles.subBtnActive : {}) }}
              onClick={() => setWhySubTab(2)}
            >
              {t.p2SubTab}
            </button>
            <button
              style={{ ...styles.subBtn, ...(whySubTab === 3 ? styles.subBtnActive : {}) }}
              onClick={() => setWhySubTab(3)}
            >
              {t.p3SubTab}
            </button>
          </div>

          {/* Problem 1: Spoiler Effect */}
          {whySubTab === 1 && (
            <div>
              <div style={styles.sectionTitle}>{t.p1Title}</div>
              <p style={styles.sectionDesc}>{t.p1Desc}</p>

              <div style={styles.controlPanel}>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.blueA1Label}</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={w1A1}
                    onChange={(e) => setW1A1(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w1A1}%</span>
                </div>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.blueA2Label}</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={w1A2}
                    onChange={(e) => setW1A2(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w1A2}%</span>
                </div>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.blackBLabel}</span>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={w1B}
                    onChange={(e) => setW1B(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w1B}%</span>
                </div>
              </div>

              <div style={styles.comparisonGrid}>
                <div style={{ ...styles.resBox, ...styles.resBoxLoser }}>
                  <h4 style={styles.boxTitle}>{t.pluralityTitle}</h4>
                  <div style={styles.winnerName}>{why1Results.pluralityWinner}</div>
                  <div style={styles.boxDesc}>{why1Results.pluralityDesc}</div>
                </div>
                <div style={{ ...styles.resBox, ...styles.resBoxWinner }}>
                  <h4 style={styles.boxTitle}>{t.condorcetTitle}</h4>
                  <div style={styles.winnerName}>{why1Results.condorcetWinner}</div>
                  <div style={styles.boxDesc}>{why1Results.condorcetDesc}</div>
                </div>
              </div>

              {/* INNER WORKINGS & VISUAL DEMO */}
              <div style={styles.innerWorkingsCard}>
                <h3 style={styles.innerTitle}>{t.howItWorksTitle}</h3>
                <div style={styles.confusionBox}>
                  <strong>{t.confusionTitle}</strong>
                  <p style={{ margin: '4px 0 0 0' }}>{t.confusionP1}</p>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.voterBreakdownTitle}</strong>
                  <div style={styles.pillContainer}>
                    <span style={{ ...styles.pill, backgroundColor: '#dbeafe', color: '#1e40af' }}>
                      {t.candBlueA1}: {w1A1}% (A1 &gt; A2 &gt; B)
                    </span>
                    <span style={{ ...styles.pill, backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                      {t.candBlueA2}: {w1A2}% (A2 &gt; A1 &gt; B)
                    </span>
                    <span style={{ ...styles.pill, backgroundColor: '#f3f4f6', color: '#1f2937' }}>
                      {t.candBlackB}: {w1B}% (B &gt; A1 &gt; A2)
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.headToHeadDuels}</strong>
                  <div style={styles.duelGrid}>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Blue A1 {t.vs} Black B</div>
                      <div style={styles.duelBody}>
                        <div>A1: {why1Results.a1VsB}% <small>(A1 + A2 voters)</small></div>
                        <div>B: {why1Results.bVsA1}%</div>
                        <div style={styles.duelWinner}>➜ Blue A1 {t.winsOver} Black B</div>
                      </div>
                    </div>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Blue A2 {t.vs} Black B</div>
                      <div style={styles.duelBody}>
                        <div>A2: {why1Results.a2VsB}% <small>(A2 + A1 voters)</small></div>
                        <div>B: {why1Results.bVsA2}%</div>
                        <div style={styles.duelWinner}>➜ Blue A2 {t.winsOver} Black B</div>
                      </div>
                    </div>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Blue A1 {t.vs} Blue A2</div>
                      <div style={styles.duelBody}>
                        <div>A1: {why1Results.a1VsA2}% <small>(A1 + B voters)</small></div>
                        <div>A2: {why1Results.a2VsA1}%</div>
                        <div style={styles.duelWinner}>➜ Blue A1 {t.winsOver} Blue A2</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.pairwiseMatrixTitle}</strong>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Row vs Col</th>
                        <th style={styles.th}>Blue A1</th>
                        <th style={styles.th}>Blue A2</th>
                        <th style={styles.th}>Black B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tdBold}>Blue A1</td>
                        <td style={styles.tdSelf}>-</td>
                        <td style={styles.tdWin}>{why1Results.a1VsA2}% (W)</td>
                        <td style={styles.tdWin}>{why1Results.a1VsB}% (W)</td>
                      </tr>
                      <tr>
                        <td style={styles.tdBold}>Blue A2</td>
                        <td style={styles.tdLoss}>{why1Results.a2VsA1}% (L)</td>
                        <td style={styles.tdSelf}>-</td>
                        <td style={styles.tdWin}>{why1Results.a2VsB}% (W)</td>
                      </tr>
                      <tr>
                        <td style={styles.tdBold}>Black B</td>
                        <td style={styles.tdLoss}>{why1Results.bVsA1}% (L)</td>
                        <td style={styles.tdLoss}>{why1Results.bVsA2}% (L)</td>
                        <td style={styles.tdSelf}>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Problem 2: Rewards Consensus (Political Spectrum Hard Left / Moderate / Hard Right) */}
          {whySubTab === 2 && (
            <div>
              <div style={styles.sectionTitle}>{t.p2Title}</div>
              <p style={styles.sectionDesc}>{t.p2Desc}</p>

              <div style={styles.controlPanel}>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.hardLeftLabel}</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={w2X}
                    onChange={(e) => setW2X(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w2X}%</span>
                </div>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.moderateLabel}</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={w2Y}
                    onChange={(e) => setW2Y(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w2Y}%</span>
                </div>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.hardRightLabel}</span>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={w2Z}
                    onChange={(e) => setW2Z(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <span style={styles.sliderVal}>{w2Z}%</span>
                </div>
              </div>

              <div style={styles.comparisonGrid}>
                <div style={{ ...styles.resBox, ...styles.resBoxLoser }}>
                  <h4 style={styles.boxTitle}>{t.pluralityTitle}</h4>
                  <div style={styles.winnerName}>{why2Results.pluralityWinner}</div>
                  <div style={styles.boxDesc}>
                    {t.p2PluralityDesc.replace('{w2X}', w2X)}
                  </div>
                </div>
                <div style={{ ...styles.resBox, ...styles.resBoxWinner }}>
                  <h4 style={styles.boxTitle}>{t.condorcetTitle}</h4>
                  <div style={styles.winnerName}>{why2Results.condorcetWinner}</div>
                  <div style={styles.boxDesc}>{why2Results.condorcetDesc}</div>
                </div>
              </div>

              {/* INNER WORKINGS & VISUAL DEMO */}
              <div style={styles.innerWorkingsCard}>
                <h3 style={styles.innerTitle}>{t.howItWorksTitle}</h3>
                <div style={styles.confusionBox}>
                  <strong>{t.confusionTitle}</strong>
                  <p style={{ margin: '4px 0 0 0' }}>{t.p2ConfusionText}</p>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.headToHeadDuels}</strong>
                  <div style={styles.duelGrid}>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Moderate {t.vs} Hard Left</div>
                      <div style={styles.duelBody}>
                        <div>Moderate: {why2Results.yVsX}% <small>(Moderate + Hard Right voters)</small></div>
                        <div>Hard Left: {why2Results.xVsY}%</div>
                        <div style={styles.duelWinner}>➜ Moderate Center {t.winsOver} Hard Left</div>
                      </div>
                    </div>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Moderate {t.vs} Hard Right</div>
                      <div style={styles.duelBody}>
                        <div>Moderate: {why2Results.yVsZ}% <small>(Moderate + Hard Left voters)</small></div>
                        <div>Hard Right: {why2Results.zVsY}%</div>
                        <div style={styles.duelWinner}>➜ Moderate Center {t.winsOver} Hard Right</div>
                      </div>
                    </div>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Hard Right {t.vs} Hard Left</div>
                      <div style={styles.duelBody}>
                        <div>Hard Right: {why2Results.zVsX}% <small>(Right + Moderate voters)</small></div>
                        <div>Hard Left: {why2Results.xVsZ}%</div>
                        <div style={styles.duelWinner}>➜ Hard Right {t.winsOver} Hard Left</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.pairwiseMatrixTitle}</strong>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Row vs Col</th>
                        <th style={styles.th}>Hard Left</th>
                        <th style={styles.th}>Moderate Center</th>
                        <th style={styles.th}>Hard Right</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tdBold}>Hard Left</td>
                        <td style={styles.tdSelf}>-</td>
                        <td style={styles.tdLoss}>{why2Results.xVsY}% (L)</td>
                        <td style={styles.tdLoss}>{why2Results.xVsZ}% (L)</td>
                      </tr>
                      <tr>
                        <td style={styles.tdBold}>Moderate Center</td>
                        <td style={styles.tdWin}>{why2Results.yVsX}% (W)</td>
                        <td style={styles.tdSelf}>-</td>
                        <td style={styles.tdWin}>{why2Results.yVsZ}% (W)</td>
                      </tr>
                      <tr>
                        <td style={styles.tdBold}>Hard Right</td>
                        <td style={styles.tdWin}>{why2Results.zVsX}% (W)</td>
                        <td style={styles.tdLoss}>{why2Results.zVsY}% (L)</td>
                        <td style={styles.tdSelf}>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Problem 3: Honest Preferences */}
          {whySubTab === 3 && (
            <div>
              <div style={styles.sectionTitle}>{t.p3Title}</div>
              <p style={styles.sectionDesc}>{t.p3Desc}</p>

              <div style={styles.controlPanel}>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{t.strategyLabel}</span>
                  <select
                    value={w3Strategy}
                    onChange={(e) => setW3Strategy(e.target.value)}
                    style={styles.selectInput}
                  >
                    <option value="honest">{t.optHonest}</option>
                    <option value="tactical">{t.optTactical}</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Comparison Boxes */}
              <div style={styles.comparisonGrid}>
                <div style={{ ...styles.resBox, ...(w3Strategy === 'honest' ? styles.resBoxLoser : styles.resBoxWarning) }}>
                  <h4 style={styles.boxTitle}>{t.pluralityTitle}</h4>
                  <div style={styles.winnerName}>
                    {w3Strategy === 'honest' ? t.p3PluralityWinHonest : t.p3PluralityWinTactical}
                  </div>
                  <div style={styles.boxDesc}>
                    {w3Strategy === 'honest' ? t.p3PluralityDescHonest : t.p3PluralityDescTactical}
                  </div>
                </div>
                <div style={{ ...styles.resBox, ...styles.resBoxWinner }}>
                  <h4 style={styles.boxTitle}>{t.condorcetTitle}</h4>
                  <div style={styles.winnerName}>{t.p3CondorcetWin}</div>
                  <div style={styles.boxDesc}>
                    {w3Strategy === 'honest' ? t.p3CondorcetDescHonest : t.p3CondorcetDescTactical}
                  </div>
                </div>
              </div>

              {/* Comprehensive Breakdown Table of Vote System vs Strategy */}
              <div style={styles.innerWorkingsCard}>
                <h3 style={styles.innerTitle}>{t.p3ConfusionTitle}</h3>
                <div style={styles.confusionBox}>
                  <p style={{ margin: 0 }}>{t.p3ConfusionText}</p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <strong>{lang === 'zh' ? '📊 不同表態策略與投票制度的實際票數對比表' : '📊 Actual Vote Count & Winner Comparison Across Strategies'}</strong>
                  <table style={{ ...styles.table, marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>{lang === 'zh' ? '投票策略 (Strategy)' : 'Strategy'}</th>
                        <th style={styles.th}>{lang === 'zh' ? '綠隊 M 首選選民行為' : 'Green M Voters'}</th>
                        <th style={styles.th}>{lang === 'zh' ? '單記名票數 (Plurality #1 Votes)' : 'Plurality Votes'}</th>
                        <th style={styles.th}>{lang === 'zh' ? '單記名勝者 (Plurality Winner)' : 'Plurality Winner'}</th>
                        <th style={styles.th}>{lang === 'zh' ? '孔多塞關鍵對決 (Condorcet S vs R Duel)' : 'Condorcet S vs R Duel'}</th>
                        <th style={styles.th}>{lang === 'zh' ? '孔多塞勝者 (Condorcet Winner)' : 'Condorcet Winner'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={w3Strategy === 'honest' ? { backgroundColor: '#f0fdf4' } : {}}>
                        <td style={styles.tdBold}>{lang === 'zh' ? '真實表態 (Honest)' : 'Honest Ballot'}</td>
                        <td style={styles.td}>M &gt; S &gt; R (5%)</td>
                        <td style={styles.td}>M: 5% | S: 47% | <strong>R: 48%</strong></td>
                        <td style={{ ...styles.td, color: '#b91c1c', fontWeight: 'bold' }}>
                          Orange R ❌ <small>({lang === 'zh' ? '最差結果' : 'Worst'})</small>
                        </td>
                        <td style={styles.td}>S: (47+5)=<strong>52%</strong> vs R: 48%</td>
                        <td style={{ ...styles.td, color: '#15803d', fontWeight: 'bold' }}>
                          Cyan S ✅ <small>({lang === 'zh' ? '理想結果' : 'Ideal'})</small>
                        </td>
                      </tr>
                      <tr style={w3Strategy === 'tactical' ? { backgroundColor: '#fffbeb' } : {}}>
                        <td style={styles.tdBold}>{lang === 'zh' ? '策略棄保 (Tactical)' : 'Tactical Ballot'}</td>
                        <td style={styles.td}>S &gt; M &gt; R (5%) <small>({lang === 'zh' ? '違心謊報' : 'Lying'})</small></td>
                        <td style={styles.td}>M: 0% | <strong>S: 52%</strong> | R: 48%</td>
                        <td style={{ ...styles.td, color: '#d97706', fontWeight: 'bold' }}>
                          Cyan S ⚠️ <small>({lang === 'zh' ? '被迫棄保' : 'Forced'})</small>
                        </td>
                        <td style={styles.td}>S: (52+0)=<strong>52%</strong> vs R: 48%</td>
                        <td style={{ ...styles.td, color: '#15803d', fontWeight: 'bold' }}>
                          Cyan S ✅ <small>({lang === 'zh' ? '理想結果' : 'Ideal'})</small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <strong>{t.headToHeadDuels} (M &gt; S &gt; R Voter Group = 5%)</strong>
                  <div style={styles.duelGrid}>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Cyan S {t.vs} Orange R</div>
                      <div style={styles.duelBody}>
                        <div>Cyan S: {why3Results.sVsR}% <small>(47% S base + 5% M honest second choice)</small></div>
                        <div>Orange R: {why3Results.rVsS}%</div>
                        <div style={styles.duelWinner}>➜ Cyan S {t.winsOver} Orange R (52% vs 48%)</div>
                      </div>
                    </div>
                    <div style={styles.duelCard}>
                      <div style={styles.duelHeader}>Green M {t.vs} Cyan S</div>
                      <div style={styles.duelBody}>
                        <div>Green M: {why3Results.mVsS}%</div>
                        <div>Cyan S: {why3Results.sVsM}%</div>
                        <div style={styles.duelWinner}>➜ Cyan S {t.winsOver} Green M (95% vs 5%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: TIE-BREAKING ALGORITHMS */}
      {mainTab === 'ties' && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>{t.tieTitle}</div>
          <p style={styles.sectionDesc}>{t.tieDesc}</p>

          <div style={styles.subTabs}>
            <button
              style={{ ...styles.subBtn, ...(tieSubTab === 1 ? styles.subBtnActive : {}) }}
              onClick={() => setTieSubTab(1)}
            >
              {t.tieSubSchulze}
            </button>
            <button
              style={{ ...styles.subBtn, ...(tieSubTab === 2 ? styles.subBtnActive : {}) }}
              onClick={() => setTieSubTab(2)}
            >
              {t.tieSubRP}
            </button>
            <button
              style={{ ...styles.subBtn, ...(tieSubTab === 3 ? styles.subBtnActive : {}) }}
              onClick={() => setTieSubTab(3)}
            >
              {t.tieSubCopeland}
            </button>
          </div>

          <div style={styles.controlPanel}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
              {t.marginsHeader}
            </div>
            <div style={styles.sliderRow}>
              <span style={styles.sliderLabel}>{t.aBeatsB}</span>
              <input
                type="range"
                min="1"
                max="50"
                value={mAb}
                onChange={(e) => setMAb(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderVal}>+{mAb}</span>
            </div>
            <div style={styles.sliderRow}>
              <span style={styles.sliderLabel}>{t.bBeatsC}</span>
              <input
                type="range"
                min="1"
                max="50"
                value={mBc}
                onChange={(e) => setMBc(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderVal}>+{mBc}</span>
            </div>
            <div style={styles.sliderRow}>
              <span style={styles.sliderLabel}>{t.cBeatsA}</span>
              <input
                type="range"
                min="1"
                max="50"
                value={mCa}
                onChange={(e) => setMCa(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderVal}>+{mCa}</span>
            </div>
          </div>

          {tieSubTab === 1 && (
            <div>
              <div style={{ ...styles.resBox, ...styles.resBoxWinner, marginBottom: '16px' }}>
                <h4 style={styles.boxTitle}>{t.schulzeWinnerTitle}</h4>
                <div style={styles.winnerName}>{tieResults.schulzeWinner}</div>
                <div style={styles.boxDesc}>{t.schulzeWinnerDesc}</div>
              </div>

              <div style={styles.stepList}>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.schulzeStep1Title}</div>
                  <div style={styles.stepDesc}>
                    A&gt;B (+{mAb}), B&gt;C (+{mBc}), C&gt;A (+{mCa})
                  </div>
                </div>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.schulzeStep2Title}</div>
                  <div style={styles.stepDesc}>
                    Path A→B→C = min({mAb}, {mBc}) = {Math.min(mAb, mBc)} | Path B→C→A = min({mBc}, {mCa}) = {Math.min(mBc, mCa)}
                  </div>
                </div>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.schulzeStep3Title}</div>
                  <div style={styles.stepDesc}>
                    {t.schulzeStep3Desc.replace('{minMargin}', tieResults.minMargin).replace('{schulzeWinner}', tieResults.schulzeWinner)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tieSubTab === 2 && (
            <div>
              <div style={{ ...styles.resBox, ...styles.resBoxWinner, marginBottom: '16px' }}>
                <h4 style={styles.boxTitle}>{t.rpWinnerTitle}</h4>
                <div style={styles.winnerName}>{tieResults.rpWinner}</div>
                <div style={styles.boxDesc}>{t.rpWinnerDesc}</div>
              </div>

              <div style={styles.stepList}>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.rpStep1Title}</div>
                  <div style={styles.stepDesc}>
                    1. {tieResults.first.winner} &gt; {tieResults.first.loser} (+{tieResults.first.margin}) |
                    2. {tieResults.second.winner} &gt; {tieResults.second.loser} (+{tieResults.second.margin}) |
                    3. {tieResults.third.winner} &gt; {tieResults.third.loser} (+{tieResults.third.margin})
                  </div>
                </div>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.rpStep2Title}</div>
                  <div style={styles.stepDesc}>
                    • <strong>{t.rpStep2Lock}</strong> {tieResults.first.winner} → {tieResults.first.loser} (+{tieResults.first.margin})<br />
                    • <strong>{t.rpStep2Lock}</strong> {tieResults.second.winner} → {tieResults.second.loser} (+{tieResults.second.margin})<br />
                    • <strong>{t.rpStep2Discard}</strong> {tieResults.third.winner} → {tieResults.third.loser} (+{tieResults.third.margin}) <em>{t.rpStep2CycleNote}</em>
                  </div>
                </div>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.rpStep3Title}</div>
                  <div style={styles.stepDesc}>
                    {t.rpStep3Desc.replace(/{first}/g, tieResults.first.winner).replace('{second}', tieResults.first.loser).replace('{third}', tieResults.second.loser)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tieSubTab === 3 && (
            <div>
              <div style={{ ...styles.resBox, ...styles.resBoxWinner, marginBottom: '16px' }}>
                <h4 style={styles.boxTitle}>{t.copelandWinnerTitle}</h4>
                <div style={styles.winnerName}>{t.copelandTie}</div>
                <div style={styles.boxDesc}>{t.copelandWinnerDesc}</div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{t.thCandidate}</th>
                    <th style={styles.th}>{t.thWins}</th>
                    <th style={styles.th}>{t.thLosses}</th>
                    <th style={styles.th}>{t.thScore}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={styles.td}>{lang === 'zh' ? '候選人 A' : 'Candidate A'}</td><td style={styles.td}>1</td><td style={styles.td}>1</td><td style={styles.td}>1.0</td></tr>
                  <tr><td style={styles.td}>{lang === 'zh' ? '候選人 B' : 'Candidate B'}</td><td style={styles.td}>1</td><td style={styles.td}>1</td><td style={styles.td}>1.0</td></tr>
                  <tr><td style={styles.td}>{lang === 'zh' ? '候選人 C' : 'Candidate C'}</td><td style={styles.td}>1</td><td style={styles.td}>1</td><td style={styles.td}>1.0</td></tr>
                </tbody>
              </table>

              <div style={{ ...styles.stepList, marginTop: '16px' }}>
                <div style={styles.stepItem}>
                  <div style={styles.stepTitle}>{t.copelandNoteTitle}</div>
                  <div style={styles.stepDesc}>{t.copelandNoteDesc}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    padding: '24px 16px',
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    lineHeight: '1.5',
  },
  header: {
    marginBottom: '8px',
  },
  langToggleRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '8px',
  },
  langToggleBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2563eb',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0',
  },
  subtitle: {
    color: '#475569',
    fontSize: '0.95rem',
    marginTop: '6px',
  },
  navTabs: {
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '2px',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 18px',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#475569',
    cursor: 'pointer',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    borderBottom: '3px solid #2563eb',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
  },
  subTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  subBtn: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#475569',
  },
  subBtnActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#0f172a',
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: '#475569',
    marginBottom: '16px',
  },
  controlPanel: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '12px',
  },
  sliderLabel: {
    fontSize: '0.88rem',
    fontWeight: '600',
    minWidth: '220px',
  },
  rangeInput: {
    flexGrow: 1,
    accentColor: '#2563eb',
    cursor: 'pointer',
  },
  sliderVal: {
    fontWeight: '700',
    width: '45px',
    textAlign: 'right',
    fontSize: '0.9rem',
  },
  selectInput: {
    padding: '6px 12px',
    fontWeight: '600',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '0.88rem',
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  resBox: {
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#fafafa',
  },
  resBoxWinner: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  resBoxLoser: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  resBoxWarning: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  boxTitle: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    color: '#475569',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    marginTop: '0',
  },
  winnerName: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  boxDesc: {
    fontSize: '0.85rem',
    color: '#475569',
    marginTop: '4px',
  },
  innerWorkingsCard: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
  },
  innerTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 12px 0',
    color: '#1e293b',
  },
  confusionBox: {
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #f59e0b',
    padding: '10px 14px',
    borderRadius: '0 6px 6px 0',
    fontSize: '0.88rem',
    color: '#78350f',
  },
  pillContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  pill: {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  duelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginTop: '8px',
  },
  duelCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
  },
  duelHeader: {
    fontWeight: '700',
    fontSize: '0.9rem',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '4px',
    marginBottom: '6px',
    color: '#1e293b',
  },
  duelBody: {
    fontSize: '0.85rem',
    color: '#475569',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  duelWinner: {
    fontWeight: '700',
    color: '#059669',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '8px',
    fontSize: '0.88rem',
  },
  th: {
    border: '1px solid #cbd5e1',
    padding: '8px 10px',
    textAlign: 'center',
    backgroundColor: '#e2e8f0',
    fontWeight: '600',
  },
  td: {
    border: '1px solid #e2e8f0',
    padding: '8px 10px',
    textAlign: 'center',
  },
  tdBold: {
    border: '1px solid #cbd5e1',
    padding: '8px 10px',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
  },
  tdSelf: {
    border: '1px solid #e2e8f0',
    padding: '8px 10px',
    textAlign: 'center',
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
  },
  tdWin: {
    border: '1px solid #e2e8f0',
    padding: '8px 10px',
    textAlign: 'center',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontWeight: '700',
  },
  tdLoss: {
    border: '1px solid #e2e8f0',
    padding: '8px 10px',
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  stepItem: {
    backgroundColor: '#f8fafc',
    borderLeft: '4px solid #2563eb',
    padding: '12px 16px',
    borderRadius: '0 8px 8px 0',
  },
  stepTitle: {
    fontWeight: '700',
    fontSize: '0.9rem',
    marginBottom: '4px',
    color: '#2563eb',
  },
  stepDesc: {
    fontSize: '0.88rem',
    color: '#475569',
  },
};

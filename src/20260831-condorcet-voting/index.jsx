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

    // Problem 1
    p1Title: 'Scenario: The Vote-Splitting Spoiler Effect (分票效應)',
    p1Desc: 'In Plurality Voting (單記名投票), two similar Blue candidates (A1 & A2) split the majority vote, allowing Black B to win despite 55% of voters preferring a Blue.',
    progA1Label: 'Blue A1 (A1 > A2 > B):',
    progA2Label: 'Blue A2 (A2 > A1 > B) [Spoiler]:',
    consBLabel: 'Black B (B > A1 > A2):',
    pluralityTitle: 'Plurality Voting (單記名投票)',
    condorcetTitle: 'Condorcet Method (孔多塞投票法)',
    p1PluralityWinB: 'Wins with {w1B}% plurality because A1 ({w1A1}%) and A2 ({w1A2}%) split votes.',
    p1PluralityWinA1: 'Blues united enough to overcome B ({w1B}%).',
    p1PluralityWinA2: 'Blues united enough to overcome B ({w1B}%).',
    p1CondorcetB: 'Black B defeats both head-to-head ({w1B}% vs {progTotal}%).',
    p1CondorcetBlue: 'Blues beat Black B ({progTotal}% vs {w1B}%) head-to-head because voters transfer rankings!',

    // Problem 2
    p2Title: 'Scenario: Polarizing vs. Moderate Consensus Candidate (廣泛共識候選人)',
    p2Desc: 'Plurality awards victory to Candidate X because X has a passionate base, even though 60% of voters despise X. Condorcet selects Candidate Y, who is universally acceptable.',
    hardLeftLabel: 'Hard Left X (X > Y > Z):',
    moderateLabel: 'Moderate Y (Y > Z > X):',
    hardRightLabel: 'Hard Right Z (Z > Y > X):',
    p2PluralityDesc: 'Wins with {w2X}% 1st-choice votes despite 60% ranking X last.',
    p2CondorcetDesc: 'Y beats X ({yVsX}% vs {w2X}%) AND Y beats Z ({yVsZ}% vs {w2Z}%) in direct matchups!',
    p2CondorcetFailDesc: 'Extremes outweighed moderate preferences.',

    // Problem 3
    p3Title: 'Scenario: Strategic vs. Honest Preferences (真實偏好與策略性投票)',
    p3Desc: 'Test how a voter who loves Third-Party Candidate M but wants Mainstream Candidate S to beat Rival R behaves under both systems.',
    strategyLabel: 'Your Preference Strategy:',
    optHonest: 'Honest Ballot: Rank M #1, S #2, R #3',
    optTactical: 'Tactical Ballot: Compromise & Vote S #1 directly',
    p3PluralityWinHonest: 'Rival R Wins!',
    p3PluralityWinTactical: 'Mainstream S Wins',
    p3PluralityDescHonest: 'Your 1st-choice vote went to Third-Party M (5%). Mainstream S loses to Rival R (47 vs 48). Your vote was wasted!',
    p3PluralityDescTactical: 'You were forced to compromise and vote S #1 directly to stop R. Third-party M got 0% support.',
    p3CondorcetWin: 'Mainstream S Wins!',
    p3CondorcetDescHonest: 'You ranked M #1 and S #2. In S vs R, your ballot fully supports S (52 vs 48). You safely voted 100% honestly!',
    p3CondorcetDescTactical: "Strategic lying wasn't necessary—Condorcet gives the exact same safe outcome even with an honest ballot.",

    // Ties Section
    tieTitle: 'Condorcet Cycle Resolution (孔多塞循環決同)',
    tieDesc: 'When preferences form a loop (A beats B, B beats C, C beats A), no pure Condorcet Winner (孔多塞勝者) exists. Select an algorithm below to see step-by-step how ties are broken:',
    marginsHeader: 'Simulated Cycle Head-to-Head (兩兩對決) Victory Margins:',
    aBeatsB: 'A defeats B by:',
    bBeatsC: 'B defeats C by:',
    cBeatsA: 'C defeats A by:',

    // Schulze
    schulzeWinnerTitle: 'Schulze Method Winner (舒爾茨法勝者)',
    schulzeWinnerDesc: 'Elects candidate with the strongest path across the pairwise graph.',
    schulzeStep1Title: 'Step 1: Identify Direct Matchup Strengths (兩兩對決強度)',
    schulzeStep2Title: 'Step 2: Calculate Strongest Paths (最速/最強路徑)',
    schulzeStep3Title: 'Step 3: Drop Weakest Link & Compare (移除最弱環節)',
    schulzeStep3Desc: 'The link with margin (+{minMargin}) is the weakest link in the cycle and is dropped. {schulzeWinner} retains the path of maximum strength!',

    // Ranked Pairs
    rpWinnerTitle: 'Ranked Pairs Winner (排序對分法勝者)',
    rpWinnerDesc: 'Locks in majorities in order of margin size, skipping links that create cycles.',
    rpStep1Title: 'Step 1: Sort Victories by Margin (按勝出票數排序)',
    rpStep2Title: 'Step 2: Lock Majorities (Tideman Graph 蒂德曼圖)',
    rpStep2Lock: 'Lock (鎖定):',
    rpStep2Discard: 'Discard (捨棄):',
    rpStep2CycleNote: '(Skipped because it creates a cycle / 因引致循環而跳過)',
    rpStep3Title: 'Step 3: Final Order (最終層級構造)',
    rpStep3Desc: 'Locked graph hierarchy: Candidate {first} → Candidate {second} → Candidate {third}. Winner is Candidate {first}.',

    // Copeland
    copelandWinnerTitle: "Copeland's Method Winner (科普蘭法勝者)",
    copelandTie: '3-Way Tie (1.0 pt each / 三方平手 各得 1.0 分)',
    copelandWinnerDesc: 'Assigns 1 point per win, 0.5 for ties, 0 for loss.',
    thCandidate: 'Candidate (候選人)',
    thWins: 'Wins (勝)',
    thLosses: 'Losses (負)',
    thScore: 'Copeland Score (科普蘭得分)',
    copelandNoteTitle: 'Tie-Breaker Rule for Copeland (科普蘭法之決同規則)',
    copelandNoteDesc: 'Because Copeland only counts win/loss status (+1 / 0) without considering victory margins, circular ties always yield identical scores (1.0 each). Systems resolve this using margin sums or secondary preference runoffs.',

    // Candidates
    candBlueA1: 'Blue A1 (藍色陣營 A1)',
    candBlueA2: 'Blue A2 (藍色陣營 A2)',
    candBlackB: 'Black B (黑色陣營 B)',
    candX: 'Candidate X (候選人 X)',
    candY: 'Moderate Y (中立派 Y)',
    candZ: 'Candidate Z (候選人 Z)',
    candPolarizing: 'Polarizing Candidate (極端候選人)',
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

    // Problem 1
    p1Title: '情境：分票效應 (Vote-Splitting Spoiler Effect)',
    p1Desc: '在傳統單記名投票 (Plurality Voting) 中，兩位立場相近的藍色陣營候選人 (A1 與 A2)瓜分了多數選票，導致黑色陣營候選人 B 在 55% 選民偏好藍色陣營的情況下依然勝出。',
    progA1Label: '藍色陣營 A1 (A1 > A2 > B):',
    progA2Label: '藍色陣營 A2 (A2 > A1 > B) [分票者]:',
    consBLabel: '黑色陣營 B (B > A1 > A2):',
    pluralityTitle: '單記名投票 (Plurality Voting)',
    condorcetTitle: '孔多塞投票法 (Condorcet Method)',
    p1PluralityWinB: '以 {w1B}% 簡單多數勝出，因 A1 ({w1A1}%) 與 A2 ({w1A2}%) 互相分散了票源。',
    p1PluralityWinA1: '藍色陣營票源足夠集中，擊敗了黑色陣營 B ({w1B}%)。',
    p1PluralityWinA2: '藍色陣營票源足夠集中，擊敗了黑色陣營 B ({w1B}%)。',
    p1CondorcetB: '黑色陣營 B 在兩兩對決 (Head-to-Head) 中均擊敗對手 ({w1B}% vs {progTotal}%)。',
    p1CondorcetBlue: '藍色陣營在兩兩對決中擊敗黑色陣營 B ({progTotal}% vs {w1B}%)，因為選民的次要排序發揮了轉移作用！',

    // Problem 2
    p2Title: '情境：極端派 vs. 中立共識候選人 (Broad Consensus Candidate)',
    p2Desc: '單記名投票 (Plurality Voting) 將勝利頒給擁有狂熱基本盤的候選人 X，即使有 60% 的選民極度排斥 X。孔多塞投票法 (Condorcet Method) 則選出普遍被接受的中立候選人 Y。',
    hardLeftLabel: '極左派 X (X > Y > Z):',
    moderateLabel: '中立派 Y (Y > Z > X):',
    hardRightLabel: '極右派 Z (Z > Y > X):',
    p2PluralityDesc: '憑藉 {w2X}% 的第一志願票勝出，儘管有 60% 選民將 X 排在最後一名。',
    p2CondorcetDesc: 'Y 在直接對決中同時擊敗 X ({yVsX}% vs {w2X}%) 及 Z ({yVsZ}% vs {w2Z}%)！',
    p2CondorcetFailDesc: '兩極化的選民偏好壓倒了中立候選人。',

    // Problem 3
    p3Title: '情境：策略性投票 vs. 真實偏好 (Strategic vs. Honest Preferences)',
    p3Desc: '測試選民在偏好第三勢力候選人 M 但希望主流候選人 S 打敗對手 R 時，在兩種制度下的表態行為。',
    strategyLabel: '您的投票策略 (Preference Strategy):',
    optHonest: '真實選票 (Honest Ballot): 排序 M #1, S #2, R #3',
    optTactical: '策略選票 (Tactical Ballot): 配票/棄保，直接配票給 S #1',
    p3PluralityWinHonest: '競爭對手 R 勝出！(Rival R Wins)',
    p3PluralityWinTactical: '主流候選人 S 勝出 (Mainstream S Wins)',
    p3PluralityDescHonest: '您的首選票給了第三勢力 M (5%)。主流 S 以 47 比 48 輸給對手 R。您的選票變成了廢票 (Wasted Vote)！',
    p3PluralityDescTactical: '您被迫妥協棄保，直接投給 S 以阻止 R 勝出。第三勢力 M 獲得 0% 支持率。',
    p3CondorcetWin: '主流候選人 S 勝出！(Mainstream S Wins)',
    p3CondorcetDescHonest: '您將 M 排在 #1、S 排在 #2。在 S 對決 R 時，您的選票會全數轉移支持 S (52 vs 48)。您可無後顧之憂地表達真實偏好！',
    p3CondorcetDescTactical: '不需要策略性說謊——孔多塞投票法 (Condorcet Method) 在真實表態下也能給出完全相同的安全結果。',

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
    copelandNoteDesc: '由於科普蘭法只計算勝負狀態 (+1 / 0) 而忽略勝出票差 (Victory Margins)，循環同分時總會得到相同的分數 (各 1.0 分)。實務上需配合票差總和或二次偏好決選。',

    // Candidates
    candBlueA1: '藍色陣營 A1 (Blue A1)',
    candBlueA2: '藍色陣營 A2 (Blue A2)',
    candBlackB: '黑色陣營 B (Black B)',
    candX: '候選人 X (Candidate X)',
    candY: '中立派 Y (Moderate Y)',
    candZ: '候選人 Z (Candidate Z)',
    candPolarizing: '極端候選人 (Polarizing Candidate)',
  }
};

export default function CondorcetInteractiveSuite() {
  // Language State: 'zh' for Traditional Chinese (Hong Kong), 'en' for English
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

  // Problem 2 State (Broad Consensus)
  const [w2X, setW2X] = useState(40); // Hard Left X
  const [w2Y, setW2Y] = useState(25); // Moderate Y
  const [w2Z, setW2Z] = useState(35); // Hard Right Z

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
      condorcetDesc = t.p1CondorcetBlue.replace('{progTotal}', progTotal).replace('{w1B}', w1B);
    }

    return { pluralityWinner, pluralityDesc, condorcetWinner, condorcetDesc };
  }, [w1A1, w1A2, w1B, t]);

  // Problem 2 Derived Calculations
  const why2Results = useMemo(() => {
    let pluralityWinner = t.candX;
    if (w2Y > w2X && w2Y > w2Z) pluralityWinner = t.candY;
    if (w2Z > w2X && w2Z > w2Y) pluralityWinner = t.candZ;

    const yVsX = w2Y + w2Z;
    const yVsZ = w2Y + w2X;

    let condorcetWinner = t.candPolarizing;
    let condorcetDesc = t.p2CondorcetFailDesc;

    if (yVsX > w2X && yVsZ > w2Z) {
      condorcetWinner = t.candY;
      condorcetDesc = t.p2CondorcetDesc.replace('{yVsX}', yVsX).replace('{w2X}', w2X).replace('{yVsZ}', yVsZ).replace('{w2Z}', w2Z);
    }

    return { pluralityWinner, condorcetWinner, condorcetDesc };
  }, [w2X, w2Y, w2Z, t]);

  // Tie Breaker Calculations
  const tieResults = useMemo(() => {
    // Schulze
    const minMargin = Math.min(mAb, mBc, mCa);
    let schulzeWinnerKey = 'B';
    if (minMargin === mAb) schulzeWinnerKey = 'C';
    if (minMargin === mBc) schulzeWinnerKey = 'A';
    if (minMargin === mCa) schulzeWinnerKey = 'B';

    const schulzeWinner = `${lang === 'zh' ? '候選人' : 'Candidate'} ${schulzeWinnerKey}`;

    // Ranked Pairs
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
         <div style={styles.langToggleBar}>
          <button
            style={styles.langToggleBtn}
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            title="Switch Language / 切換語言"
          >
            🌐 {t.langBtn}
          </button>
	</div>
        <div style={styles.headerTopRow}>
          <h1 style={styles.title}>{t.title}</h1>
        </div>
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
                  <span style={styles.sliderLabel}>{t.progA1Label}</span>
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
                  <span style={styles.sliderLabel}>{t.progA2Label}</span>
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
                  <span style={styles.sliderLabel}>{t.consBLabel}</span>
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
            </div>
          )}

          {/* Problem 2: Rewards Consensus */}
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

          {/* Schulze Output */}
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

          {/* Ranked Pairs Output */}
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

          {/* Copeland Output */}
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

// Inline Styles Object
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
  langToggleBar: {
    margin: '0 0 1.5rem 0',
    textAlign: 'right',
  },
  header: {
    marginBottom: '8px',
  },
  headerTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
    fontSize: '0.88rem',
  },
  th: {
    border: '1px solid #e2e8f0',
    padding: '10px 12px',
    textAlign: 'center',
    backgroundColor: '#f1f5f9',
    fontWeight: '600',
  },
  td: {
    border: '1px solid #e2e8f0',
    padding: '10px 12px',
    textAlign: 'center',
  },
};

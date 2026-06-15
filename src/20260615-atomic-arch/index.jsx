export const meta = {
  title: 'Atomic Arch',
  description: 'What is happening with the latest Arch AUR exploitation',
  tags: ['AGPL', 'GPL', 'AGPLv3', 'GPLv3'],
};

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Package, 
  Terminal, 
  GitBranch, 
  Users, 
  Server, 
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2,
  Lock,
  Globe,
  UserPlus
} from 'lucide-react';

const t = (lang, en, zh) => lang === 'en' ? en : zh;

export default function AtomicArchDashboard() {
  const [activeTab, setActiveTab] = useState('ecosystem');
  const [lang, setLang] = useState('en');

  const tabs = [
    { id: 'ecosystem', labelEn: '1. Package Channels', labelZh: '1. 套件頻道', labelZhSub: '(Package Channels)', icon: Database },
    { id: 'aur-guide', labelEn: '2. AUR Publishing', labelZh: '2. AUR 發佈', labelZhSub: '(AUR Publishing)', icon: GitBranch },
    { id: 'adopt-orphan', labelEn: '3. Adopting Orphans', labelZh: '3. 接管孤兒套件', labelZhSub: '(Adopting Orphans)', icon: UserPlus },
    { id: 'exploit', labelEn: '4. The Atomic Exploit', labelZh: '4. Atomic 漏洞利用', labelZhSub: '(The Atomic Exploit)', icon: AlertTriangle },
    { id: 'impact', labelEn: '5. Blast Radius', labelZh: '5. 影響範圍', labelZhSub: '(Blast Radius)', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-10 h-10 text-red-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {t(lang, 'Atomic Arch: Campaign Analysis', 'Atomic Arch：攻擊行動分析 (Campaign Analysis)')}
                </h1>
              </div>
              <p className="text-slate-400 text-lg max-w-3xl">
                {t(lang, 
                  'An interactive breakdown of the Arch Linux packaging ecosystem and the June 2026 supply-chain attack that compromised the Arch User Repository (AUR).',
                  '互動式解析 Arch Linux 套件生態系統 (packaging ecosystem) 以及 2026 年 6 月入侵 Arch 使用者儲存庫 (Arch User Repository, AUR) 的供應鏈攻擊 (supply-chain attack)。'
                )}
              </p>
            </div>
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-md transition-colors shrink-0"
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? '中文 (繁體)' : 'English'}
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-center leading-tight">
                  {lang === 'en' ? tab.labelEn : (
                    <>
                      <span className="block">{tab.labelZh}</span>
                      <span className="block text-[11px] opacity-75 mt-0.5">{tab.labelZhSub}</span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <main className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-6 md:p-8">
          {activeTab === 'ecosystem' && <EcosystemTab lang={lang} />}
          {activeTab === 'aur-guide' && <AURPublishingTab lang={lang} />}
          {activeTab === 'adopt-orphan' && <AdoptOrphanTab lang={lang} />}
          {activeTab === 'exploit' && <ExploitTab lang={lang} />}
          {activeTab === 'impact' && <ImpactTab lang={lang} />}
        </main>
      </div>
    </div>
  );
}

function EcosystemTab({ lang }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {t(lang, 'Arch Linux Package Ecosystem', 'Arch Linux 套件生態系統 (Package Ecosystem)')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t(lang,
            'Arch Linux splits its software distribution into official, pre-compiled repositories and a massive, crowdsourced repository for build recipes. Understanding this split is crucial to understanding system security.',
            'Arch Linux 將其軟件分發分為官方的預編譯儲存庫 (pre-compiled repositories)，以及一個龐大的、由群眾外包的構建配方儲存庫 (build recipes repository)。理解這種劃分對於理解系統安全至關重要。'
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Official Repos */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-bold text-white">
              {t(lang, 'Official Repositories', '官方儲存庫 (Official Repositories)')}
            </h3>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono mt-0.5">core</span>
              <span className="text-sm text-slate-300">
                {t(lang, 'Essential boot/system tools (kernel, systemd).', '核心啟動/系統工具 (kernel, systemd)。')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono mt-0.5">extra</span>
              <span className="text-sm text-slate-300">
                {t(lang, 'Standard apps (browsers, desktop environments).', '標準應用程式 (browsers, desktop environments)。')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono mt-0.5">multilib</span>
              <span className="text-sm text-slate-300">
                {t(lang, '32-bit compatibility layers (Steam, Wine).', '32位元兼容層 (32-bit compatibility layers，如 Steam, Wine)。')}
              </span>
            </li>
          </ul>
          <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded text-sm text-emerald-200">
            <strong>{t(lang, 'Security:', '安全性 (Security)：')}</strong> {t(lang, 'Pre-compiled, digitally signed, and fully vetted by the core Arch team.', '預編譯 (Pre-compiled)、數碼簽署 (digitally signed)，並由 Arch 核心團隊全面審查 (fully vetted)。')}
          </div>
        </div>

        {/* The AUR */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-white">
              {t(lang, 'Arch User Repository (AUR)', 'Arch 使用者儲存庫 (Arch User Repository, AUR)')}
            </h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            {t(lang,
              'A community-driven repository containing package descriptions (PKGBUILDs) that allow users to compile a package from source and install it via `pacman`.',
              '一個由社群驅動的儲存庫，包含套件描述 (PKGBUILDs)，允許用戶從原始碼 (source) 編譯套件並透過 `pacman` 安裝。'
            )}
          </p>
          <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded text-sm text-amber-200">
            <strong>{t(lang, 'Security:', '安全性 (Security)：')}</strong> {t(lang, 'Unvetted, unsigned, and crowdsourced. Users are expected to manually review build scripts.', '未經審查 (Unvetted)、未簽署 (unsigned) 且由群眾外包 (crowdsourced)。用戶需要手動審查構建腳本 (build scripts)。')}
          </div>
        </div>
      </div>

      {/* Parallels Table */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">
          {t(lang, 'Ecosystem Parallels', '生態系統對比 (Ecosystem Parallels)')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">{t(lang, 'Linux/OS Ecosystem', 'Linux/作業系統生態 (Linux/OS Ecosystem)')}</th>
                <th className="px-4 py-3">{t(lang, 'Official / Vetted Channel', '官方 / 已審查頻道 (Official / Vetted Channel)')}</th>
                <th className="px-4 py-3 text-amber-400">{t(lang, 'Community / Unvetted Channel', '社群 / 未審查頻道 (Community / Unvetted Channel)')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="bg-slate-900">
                <td className="px-4 py-3 font-semibold text-white">Arch Linux</td>
                <td className="px-4 py-3"><code>core</code>, <code>extra</code></td>
                <td className="px-4 py-3 font-bold text-amber-500">AUR</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Ubuntu / Debian</td>
                <td className="px-4 py-3">{t(lang, 'Main / Universe Repos', 'Main / Universe 儲存庫 (Repos)')}</td>
                <td className="px-4 py-3">{t(lang, 'PPAs (Personal Package Archives)', 'PPAs (個人套件庫 / Personal Package Archives)')}</td>
              </tr>
              <tr className="bg-slate-900">
                <td className="px-4 py-3 font-semibold">Fedora</td>
                <td className="px-4 py-3">{t(lang, 'Official Fedora Repos', '官方 Fedora 儲存庫 (Official Fedora Repos)')}</td>
                <td className="px-4 py-3">COPR</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">macOS</td>
                <td className="px-4 py-3">Homebrew Core</td>
                <td className="px-4 py-3">Homebrew Taps / Casks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AURPublishingTab({ lang }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {t(lang, 'Publishing & Maintaining an AUR Package', '發佈與維護 AUR 套件 (Publishing & Maintaining an AUR Package)')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t(lang,
            'The AUR is completely crowdsourced. This means absolutely anyone on the internet can create an account and start publishing packages without prior authorization or vetting.',
            'AUR 是完全由群眾外包的 (crowdsourced)。這意味著網際網路上的任何人都可以建立帳號並開始發佈套件，無需事先授權 (authorization) 或審查 (vetting)。'
          )}
        </p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 md:ml-6 space-y-10 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-emerald-900 border-2 border-emerald-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-200">1</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Create Account & Upload SSH Key', '建立帳號並上傳 SSH 金鑰 (Account & SSH Key)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'Anyone can register on aur.archlinux.org. To gain publishing rights, you simply generate an SSH key locally and paste your public key into your account profile. No identity verification is performed.',
              '任何人都可以在 aur.archlinux.org 註冊。要獲得發佈權限，您只需在本地生成一對 SSH 金鑰，並將公開金鑰 (public key) 貼上到您的帳號設定中。這個過程不需要任何身份驗證 (identity verification)。'
            )}
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-emerald-900 border-2 border-emerald-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-200">2</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Claim a Namespace (First-Come, First-Served)', '聲明命名空間 (Claim a Namespace)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'Package names are claimed simply by pushing to them. If you push a repository named "my-awesome-app" via SSH, and it does not exist yet, you automatically become its registered owner and maintainer.',
              '套件名稱是透過推送 (pushing) 來聲明的。如果您透過 SSH 推送一個名為 "my-awesome-app" 的儲存庫，且該名稱尚不存在，您將自動成為其註冊的擁有者 (owner) 和維護者 (maintainer)。'
            )}
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-blue-900 border-2 border-blue-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-200">3</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Create the PKGBUILD', '建立 PKGBUILD (Create the PKGBUILD)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'Write a bash script defining how to download, compile, and package the software.',
              '編寫一個 bash 腳本，定義如何下載、編譯和打包軟件。'
            )}
          </p>
          <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm overflow-x-auto text-blue-300">
            pkgname=my-awesome-app<br/>
            pkgver=1.0.0<br/>
            source=("https://github.com/user/app/archive/v$pkgver.tar.gz")<br/><br/>
            package() {'{'}<br/>
            &nbsp;&nbsp;make DESTDIR="$pkgdir/" install<br/>
            {'}'}
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-blue-900 border-2 border-blue-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-200">4</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Generate Metadata (.SRCINFO)', '生成元數據 (Generate Metadata, .SRCINFO)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'The AUR website needs to read package dependencies without running bash. Generate a static info file.',
              'AUR 網站需要在不運行 bash 的情況下讀取套件依賴項 (package dependencies)。生成一個靜態資訊檔 (static info file)。'
            )}
          </p>
          <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-emerald-300">
            $ makepkg --printsrcinfo &gt; .SRCINFO
          </div>
        </div>

        {/* Step 5 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-blue-900 border-2 border-blue-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-200">5</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Clone Remote & Push', '複製遠端並推送 (Clone Remote & Push)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'Clone your empty package repository via SSH, add the files, and push to publish.',
              '透過 SSH 複製 (Clone) 您的空套件儲存庫，加入檔案，並推送 (push) 以進行發佈。'
            )}
          </p>
          <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-amber-300">
            $ git clone aur@aur.archlinux.org:my-awesome-app.git<br/>
            $ mv PKGBUILD .SRCINFO my-awesome-app/<br/>
            $ cd my-awesome-app<br/>
            $ git add PKGBUILD .SRCINFO<br/>
            $ git commit -m "Initial release"<br/>
            $ git push origin master
          </div>
        </div>

      </div>
    </div>
  );
}

function AdoptOrphanTab({ lang }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {t(lang, 'Adopting an Orphan Package', '接管孤兒套件 (Adopting an Orphan Package)')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t(lang,
            'When a package maintainer steps down or is unresponsive, the package becomes "orphaned". The AUR allows any registered user to adopt these packages to keep the community software up to date. This system, while efficient, was the primary vector for the Atomic Arch attack.',
            '當套件維護者辭去職務或失去聯絡時，該套件將成為「孤兒 (orphaned)」。AUR 允許任何註冊用戶接管這些套件，以保持社群軟件的更新。這個系統雖然高效，但卻成為了 Atomic Arch 攻擊的主要媒介。'
          )}
        </p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 md:ml-6 space-y-10 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-purple-900 border-2 border-purple-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-200">1</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Identify or File an Orphan Request', '尋找或提交孤兒套件請求 (Identify or File an Orphan Request)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'A user spots a package with an empty "Maintainer" field. Alternatively, if a package is out-of-date for over 180 days, a user can file a formal "Orphan Request". If the current maintainer does not respond within two weeks, the package is automatically orphaned.',
              '用戶發現一個「維護者 (Maintainer)」欄位為空的套件。或者，如果一個套件過期超過 180 天，用戶可以提交正式的「孤兒請求 (Orphan Request)」。如果現任維護者在兩週內沒有回應，該套件將自動成為孤兒套件。'
            )}
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-purple-900 border-2 border-purple-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-purple-200">2</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Click "Adopt Package"', '點擊「接管套件」 (Click "Adopt Package")')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'Once a package is officially orphaned, a simple "Adopt Package" link appears on its AUR web page. Any logged-in user can click this link.',
              '一旦套件正式成為孤兒套件，其 AUR 網頁上會出現一個簡單的「接管套件 (Adopt Package)」連結。任何已登入的用戶都可以點擊此連結。'
            )}
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-red-900 border-2 border-red-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-red-200">3</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Instant Push Access Granted', '立即獲得推送存取權限 (Instant Push Access Granted)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'The moment the button is clicked, the AUR infrastructure instantly associates the package with the user\'s account and SSH key. There is zero human review, no background check, and no waiting period.',
              '點擊按鈕的瞬間，AUR 基礎設施會立即將該套件與用戶的帳號和 SSH 金鑰關聯。這個過程完全沒有人工審查 (human review)，沒有背景調查，也沒有等待期。'
            )}
          </p>
        </div>

        {/* Step 4 */}
        <div className="relative pl-8">
          <div className="absolute w-6 h-6 bg-red-900 border-2 border-red-500 rounded-full -left-[13px] top-0 flex items-center justify-center">
            <span className="text-xs font-bold text-red-200">4</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t(lang, 'Push Updates (or Malware)', '推送更新（或惡意軟件） (Push Updates)')}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {t(lang,
              'The new maintainer can immediately git clone the repository, alter the PKGBUILD, and git push a new version. To thousands of end users running `yay -Syu`, this just looks like a routine software update for an old package.',
              '新維護者可以立即透過 git clone 複製儲存庫，修改 PKGBUILD，並 git push 推送新版本。對於數以千計運行 `yay -Syu` 的終端用戶來說，這看起來只不過是一個舊套件的常規軟件更新。'
            )}
          </p>
        </div>

      </div>
    </div>
  );
}

function ExploitTab({ lang }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {t(lang, 'Anatomy of the "Atomic Arch" Attack', '「Atomic Arch」攻擊剖析 (Anatomy of the "Atomic Arch" Attack)')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t(lang,
            'In June 2026, attackers compromised hundreds of AUR packages. This wasn\'t a software bug, but an exploitation of the human governance and trust model.',
            '2026 年 6 月，攻擊者入侵了數百個 AUR 套件。這不是軟件漏洞 (software bug)，而是對人類治理和信任模型 (governance and trust model) 的漏洞利用。'
          )}
        </p>
      </div>

      <div className="bg-slate-950 border border-red-900/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-6">
          <GitBranch className="w-5 h-5" /> {t(lang, 'The Attack Vector', '攻擊向量 (The Attack Vector)')}
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 translate-y-[-50%]"></div>
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              <span className="font-bold text-slate-300">1</span>
            </div>
            <h4 className="font-bold text-white mb-2">{t(lang, 'Identify Orphans', '識別孤兒套件 (Identify Orphans)')}</h4>
            <p className="text-xs text-slate-400">
              {t(lang,
                'Attackers scanned the AUR for popular packages whose maintainers had abandoned them for 180+ days.',
                '攻擊者掃描 AUR，尋找被維護者 (maintainers) 遺棄超過 180 天的熱門套件。'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              <span className="font-bold text-slate-300">2</span>
            </div>
            <h4 className="font-bold text-white mb-2">{t(lang, 'Adopt Package', '接管套件 (Adopt Package)')}</h4>
            <p className="text-xs text-slate-400">
              {t(lang,
                'Using the automated AUR request system, attackers legally claimed maintainership of the abandoned repos.',
                '使用自動化的 AUR 請求系統，攻擊者合法地取得了這些被遺棄儲存庫的維護權 (maintainership)。'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-red-900 p-4 rounded-lg relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
            <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mb-3 text-red-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-red-300 mb-2">{t(lang, 'Weaponize PKGBUILD', '武器化 PKGBUILD (Weaponize PKGBUILD)')}</h4>
            <p className="text-xs text-slate-400">
              {t(lang,
                'Pushed new version updates containing hidden NPM/Bun hooks in the package install instructions.',
                '推送包含隱藏 NPM/Bun 掛鉤 (hooks) 的新版本更新至套件安裝指令中。'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-red-900 p-4 rounded-lg relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
            <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mb-3 text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-red-300 mb-2">{t(lang, 'Payload Drop', '投遞有效負載 (Payload Drop)')}</h4>
            <p className="text-xs text-slate-400">
              {t(lang,
                'When users ran `yay -Syu`, the hooks executed during build time, dropping a Rust infostealer and eBPF rootkit.',
                '當用戶運行 `yay -Syu` 時，掛鉤 (hooks) 在構建時 (build time) 執行，植入 Rust 資訊竊取程式 (infostealer) 和 eBPF rootkit。'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl mt-6">
        <h3 className="text-lg font-bold text-white mb-3">
          {t(lang, 'Why it was devastating', '為何如此具有破壞性 (Why it was devastating)')}
        </h3>
        <ul className="space-y-4 text-sm text-slate-300">
          <li className="flex gap-3">
            <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <strong>{t(lang, 'Inherited Trust:', '繼承的信任 (Inherited Trust)：')}</strong> {t(lang, 
                'The packages kept their existing high upvote counts and names. Users updating their systems thought they were getting a normal upstream update.',
                '套件保留了現有的大量讚好 (upvote counts) 和名稱。更新系統的用戶以為他們只是獲得了正常的上游更新 (upstream update)。'
              )}
            </span>
          </li>
          <li className="flex gap-3">
            <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <strong>{t(lang, 'Build-Time Execution:', '構建時執行 (Build-Time Execution)：')}</strong> {t(lang,
                'In Arch, PKGBUILDs execute scripts locally. The malware ran *before* the software was even fully installed, bypassing standard runtime AV protections.',
                '在 Arch 中，PKGBUILD 會在本地執行腳本。惡意軟件甚至在軟件完全安裝之前就已運行，繞過了標準的運行時防毒保護 (runtime AV protections)。'
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ImpactTab({ lang }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {t(lang, 'Scope of Compromise & Safety', '入侵範圍與安全性 (Scope of Compromise & Safety)')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t(lang,
            'Understanding the blast radius is critical to knowing if your machine is compromised.',
            '了解影響範圍 (blast radius) 對於確認您的機器是否被入侵至關重要。'
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* SAFE ZONE */}
        <div className="bg-emerald-950/20 border-2 border-emerald-900/50 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <CheckCircle2 className="w-32 h-32 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" /> {t(lang, '100% Unaffected', '100% 未受影響 (100% Unaffected)')}
          </h3>
          <p className="text-sm text-slate-300 mb-4 font-semibold">
            {t(lang, 'Base Arch Linux installations using only official repositories.', '僅使用官方儲存庫 (official repositories) 的基礎 Arch Linux 安裝。')}
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>✅ <code>core</code></li>
            <li>✅ <code>extra</code></li>
            <li>✅ <code>multilib</code></li>
            <li>✅ {t(lang, 'Arch Build Infrastructure', 'Arch 構建基礎設施 (Arch Build Infrastructure)')}</li>
          </ul>
          <p className="text-xs text-emerald-500/80 mt-4 bg-emerald-950/50 p-2 rounded">
            {t(lang,
              'If you never installed an AUR helper (yay, paru) or never ran `makepkg` on third-party scripts, you are completely safe.',
              '如果您從未安裝過 AUR 助手 (AUR helper, 例如 yay, paru)，或者從未對第三方腳本執行過 `makepkg`，那麼您是非常安全的。'
            )}
          </p>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-950/20 border-2 border-red-900/50 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <AlertTriangle className="w-32 h-32 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> {t(lang, 'Affected Zone', '受影響區域 (Affected Zone)')}
          </h3>
          <p className="text-sm text-slate-300 mb-4 font-semibold">
            {t(lang, '400 to 1,500+ AUR Packages compromised in June 2026.', '2026 年 6 月有 400 到 1,500 多個 AUR 套件被入侵。')}
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>❌ {t(lang, 'Orphaned packages adopted by attackers', '被攻擊者接管的孤兒套件 (Orphaned packages)')}</li>
            <li>❌ {t(lang, 'Active packages compromised via maintainer token leaks', '透過維護者權杖外洩 (maintainer token leaks) 入侵的活躍套件')}</li>
          </ul>
          <div className="text-xs text-red-400 mt-4 bg-red-950/50 p-2 rounded space-y-2">
            <p><strong>{t(lang, 'Payload Status:', '有效負載狀態 (Payload Status)：')}</strong> {t(lang, 'Active eBPF Rootkits and secret infostealers.', '活躍的 eBPF Rootkit 和秘密資訊竊取程式 (infostealers)。')}</p>
            <p><strong>{t(lang, 'Remediation:', '補救措施 (Remediation)：')}</strong> {t(lang, 'Audit update logs. If a compromised package was built, aggressive secret rotation (SSH/Cloud tokens) and complete OS reinstall is required.', '審查更新日誌 (update logs)。如果構建了被入侵的套件，則需要進行激進的密鑰輪換 (secret rotation，如 SSH/雲端權杖) 並完全重新安裝作業系統 (OS reinstall)。')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
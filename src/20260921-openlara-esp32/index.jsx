export const meta = {
  title: 'OpenLara on ESP32',
  description: 'About a port of OpenLara on ESP32',
  tags: ['openlara', 'esp32'],
};

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  Gamepad2, 
  Monitor, 
  Volume2, 
  FolderTree, 
  Zap, 
  Code, 
  Database, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  FileText, 
  RefreshCw,
  Box,
  Server,
  ArrowDown,
  ArrowRight,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Gauge,
  Radio,
  Languages,
  Globe
} from 'lucide-react';

const SYSTEM_COMPONENTS = {
  sd_card: {
    id: 'sd_card',
    name: { en: 'MicroSD Card (SDMMC Slot)', zh: 'MicroSD Card (SDMMC 插槽)' },
    layer: { en: 'Game Assets & External Storage', zh: '遊戲資源與外部存儲層' },
    type: 'Hardware / Storage',
    tech: 'SDMMC 4-Bit Mode (40-80 MHz)',
    role: { 
      en: 'Contains original Tomb Raider asset files (.PHD, .TR2, .PCX, sound banks).', 
      zh: '包含原始 Tomb Raider 資源檔案 (.PHD, .TR2, .PCX, 音訊庫)。' 
    },
    details: { 
      en: 'Reads Tomb Raider 1 & 2 game levels from FAT32 partitions using ESP-IDF VFS SDMMC driver.', 
      zh: '使用 ESP-IDF VFS SDMMC 驅動程式從 FAT32 分區讀取 Tomb Raider 1 及 2 的關卡檔案。' 
    },
    memory: 'External Storage (Up to 64GB)',
    codeRef: 'main/sd_card.c',
    color: 'amber',
    icon: HardDrive
  },
  level_files: {
    id: 'level_files',
    name: { en: '.PHD / .TR2 Level Files', zh: '.PHD / .TR2 關卡檔案' },
    layer: { en: 'Game Assets & External Storage', zh: '遊戲資源與外部存儲層' },
    type: 'Data Files',
    tech: 'Binary Tomb Raider Formats',
    role: { 
      en: 'Defines 3D geometry, texture maps, animations, entity locations, audio samples, and AI paths.', 
      zh: '定義 3D 幾何形狀、貼圖集、動畫、實體位置、音訊採樣及 AI 路徑。' 
    },
    details: { 
      en: 'Streamed into external 32MB PSRAM on level load or background chunk fetching.', 
      zh: '在關卡加載或背景數據區塊擷取時，串流讀入外部 32MB PSRAM。' 
    },
    memory: 'Read into External PSRAM',
    codeRef: 'src/core/level.cpp',
    color: 'amber',
    icon: FileText
  },

  openlara_core: {
    id: 'openlara_core',
    name: { en: 'OpenLara Engine (XProger Core)', zh: 'OpenLara 引擎核心 (XProger Core)' },
    layer: { en: 'Core Game Engine Layer', zh: '遊戲引擎核心層' },
    type: 'C++ Portable Game Engine',
    tech: 'Software 3D Rasterizer / Fixed Point Math',
    role: { 
      en: 'Handles core Tomb Raider logic, physics, skeletal animation, camera control, sound mixing, and rasterization.', 
      zh: '處理核心 Tomb Raider 邏輯、物理碰撞、骨骼動畫、鏡頭控制、混音及 3D 光柵化。' 
    },
    details: { 
      en: 'Written by Timur "XProger" Gafarov. Platform-agnostic core ported to run on embedded hardware without desktop OpenGL/DirectX.', 
      zh: '由 Timur "XProger" Gafarov 編寫。跨平台核心經移植後可在無需桌面 OpenGL/DirectX 的嵌入式硬件上運行。' 
    },
    memory: 'Executes in Flash/IRAM; uses PSRAM for state',
    codeRef: 'src/core/*',
    color: 'cyan',
    icon: Box
  },
  renderer: {
    id: 'renderer',
    name: { en: 'Software 3D Rasterizer', zh: '軟件 3D 光柵化器 (Software 3D Rasterizer)' },
    layer: { en: 'Core Game Engine Layer', zh: '遊戲引擎核心層' },
    type: 'Graphics Engine Module',
    tech: 'Span-based / Perspective Correct Rasterization',
    role: { 
      en: 'Renders 3D polygon meshes, textured quads, lighting, and clipping into a double-buffered color frame buffer.', 
      zh: '將 3D 多邊形網格、紋理四邊形、光照及裁剪渲染至雙緩衝 (Double-Buffered) 顏色 Framebuffer。' 
    },
    details: { 
      en: 'Outputs RGBA/RGB565 framebuffers directly into high-speed PSRAM buffers.', 
      zh: '直接將 RGBA/RGB565 影格緩衝區輸出至高速 PSRAM 記憶體區塊。' 
    },
    memory: 'PSRAM Framebuffers (~1.5 MB)',
    codeRef: 'src/core/render.cpp',
    color: 'cyan',
    icon: Monitor
  },

  app_main: {
    id: 'app_main',
    name: { en: 'app_main.cpp (Entry Point)', zh: 'app_main.cpp (入口點)' },
    layer: { en: 'Application Glue Layer', zh: '應用粘合層 (Application Glue Layer)' },
    type: 'Porting Entry Point',
    tech: 'C++ / FreeRTOS Task Creator',
    role: { 
      en: 'Initializes PSRAM heap, mounts VFS SD card, sets up display/audio drivers, and spawns the main engine FreeRTOS task.', 
      zh: '初始化 PSRAM Heap，掛載 VFS SD Card，配置顯示/音訊驅動，並創建主引擎 FreeRTOS 任務。' 
    },
    details: { 
      en: 'Called by ESP-IDF runtime after second-stage bootloader and C runtime initialization.', 
      zh: '在第二階段 Bootloader 及 C Runtime 初始化後，由 ESP-IDF Runtime 調用。' 
    },
    memory: 'Internal SRAM (Stack) & IRAM',
    codeRef: 'main/main.cpp',
    color: 'emerald',
    icon: Code
  },
  display_port: {
    id: 'display_port',
    name: { en: 'Display & PPA Bridge', zh: '顯示與 PPA 橋接層 (Display & PPA)' },
    layer: { en: 'Application Glue Layer', zh: '應用粘合層 (Application Glue Layer)' },
    type: 'Hardware Abstraction Glue',
    tech: 'PPA (Pixel Processing Accelerator) API',
    role: { 
      en: 'Bridges OpenLara software framebuffers to the ESP32-P4 Hardware PPA block for fast scaling, color space conversion, and blitting to MIPI-DSI.', 
      zh: '將 OpenLara 軟件影格緩衝區連接至 ESP32-P4 硬件 PPA 模組，實現高速圖像縮放、色彩空間轉換及 Blitting 至 MIPI-DSI。' 
    },
    details: { 
      en: 'Offloads frame scaling (e.g. 320x240 to 800x480) off the RISC-V CPUs onto hardware silicon.', 
      zh: '將影格縮放任務（如 320x240 放大至 800x480）從 RISC-V CPU 卸載至硬件 PPA 晶片專用模組。' 
    },
    memory: 'Direct Memory Access (DMA)',
    codeRef: 'main/display.c',
    color: 'emerald',
    icon: RefreshCw
  },
  input_port: {
    id: 'input_port',
    name: { en: 'Input Bridge (USB HID / GPIO)', zh: '輸入橋接層 (USB HID / GPIO)' },
    layer: { en: 'Application Glue Layer', zh: '應用粘合層 (Application Glue Layer)' },
    type: 'Control Handler',
    tech: 'USB Host HID Driver / Keymaps',
    role: { 
      en: 'Captures keyboard or gamepad events via USB Host or GPIO buttons and maps them to OpenLara input state.', 
      zh: '透過 USB Host 或 GPIO 按鈕擷取鍵盤/手柄事件，並映射至 OpenLara 輸入狀態。' 
    },
    details: { 
      en: 'Pushes input events directly into OpenLara core queue without locking the rendering task.', 
      zh: '將輸入事件直接推入 OpenLara 核心隊列，避免阻塞渲染任務。' 
    },
    memory: 'SRAM Ring Buffer',
    codeRef: 'main/input.c',
    color: 'emerald',
    icon: Gamepad2
  },

  freertos: {
    id: 'freertos',
    name: { en: 'FreeRTOS Kernel (SMP)', zh: 'FreeRTOS 核心 (SMP 多核心)' },
    layer: { en: 'OS & Framework Layer', zh: '操作系統與框架層' },
    type: 'Real-Time Operating System',
    tech: 'Dual-Core Symmetric Multiprocessing (SMP)',
    role: { 
      en: 'Schedules tasks across Core 0 and Core 1, manages mutexes, queue synchronization, and interrupt handling.', 
      zh: '在 Core 0 和 Core 1 之間排程任務，管理 Mutex、Queue 同步及中斷 Handling。' 
    },
    details: { 
      en: 'Custom Espressif FreeRTOS port tailored for dual-core RISC-V interrupt handling and dynamic memory allocation.', 
      zh: '樂鑫專為雙核 RISC-V 中斷處理及動態記憶體分配定制的 FreeRTOS Port。' 
    },
    memory: 'Internal SRAM (128 KB reserved)',
    codeRef: 'ESP-IDF Components: freertos',
    color: 'purple',
    icon: Server
  },
  espidf_hal: {
    id: 'espidf_hal',
    name: { en: 'ESP-IDF Drivers & HAL', zh: 'ESP-IDF 驅動與 HAL 抽象層' },
    layer: { en: 'OS & Framework Layer', zh: '操作系統與框架層' },
    type: 'Software Development Kit',
    tech: 'MIPI-DSI, SDMMC, I2S, PPA, USB Host Drivers',
    role: { 
      en: 'Provides low-level API abstraction for the hardware peripherals on ESP32-P4.', 
      zh: '為 ESP32-P4 上的硬件外設提供底層 API 抽象層。' 
    },
    details: { 
      en: 'Includes VFS (Virtual File System), NVS (Non-Volatile Storage), and heap allocators (SRAM vs PSRAM caps).', 
      zh: '包含 VFS (虛擬檔案系統)、NVS (非易失性存儲) 及 Heap 分配器 (SRAM vs PSRAM 能力標籤)。' 
    },
    memory: 'Flash / Internal SRAM',
    codeRef: 'ESP-IDF Components: driver, esp_driver_*',
    color: 'purple',
    icon: Layers
  },

  riscv_cpu: {
    id: 'riscv_cpu',
    name: { en: 'Dual RISC-V High-Perf Cores', zh: '雙核 RISC-V 高效能核心' },
    layer: { en: 'Physical Hardware Layer', zh: '實體硬件層 (Hardware Layer)' },
    type: 'SoC Compute Cores',
    tech: '2x RV32IMAFCP @ up to 400 MHz',
    role: { 
      en: 'Executes game logic, physics, 3D software rasterization, and OS thread scheduling.', 
      zh: '執行遊戲邏輯、物理計算、3D 軟件光柵化及 OS 線程排程。' 
    },
    details: { 
      en: 'Includes Floating Point Unit (FPU), SIMD DSP instructions, and L1 Caches for high throughput vector calculations.', 
      zh: '內建浮點運算單元 (FPU)、SIMD DSP 指令集及 L1 快取，以實現高吞吐量向量計算。' 
    },
    memory: 'Silicon HW Core',
    codeRef: 'ESP32-P4 Hardware',
    color: 'blue',
    icon: Cpu
  },
  psram: {
    id: 'psram',
    name: { en: '32MB External PSRAM (HEX)', zh: '32MB 外部 PSRAM (HEX 模式)' },
    layer: { en: 'Physical Hardware Layer', zh: '實體硬件層 (Hardware Layer)' },
    type: 'High-Speed Memory Chip',
    tech: 'Hexalbus / Octal SPI @ 200MHz+',
    role: { 
      en: 'Stores large Tomb Raider level geometries, textures, audio buffers, and framebuffers.', 
      zh: '存放龐大的 Tomb Raider 關卡幾何數據、貼圖集、音訊緩衝區及雙 Framebuffer。' 
    },
    details: { 
      en: 'Crucial component! Internal SRAM (768KB) is far too small for 3D game engine data structures.', 
      zh: '關鍵組件！內部 SRAM (768KB) 容量過小，無法容納 3D 遊戲引擎的數據結構。' 
    },
    memory: '32 MegaBytes',
    codeRef: 'Hardware Memory Bus',
    color: 'blue',
    icon: Database
  },
  mipi_dsi: {
    id: 'mipi_dsi',
    name: { en: 'MIPI-DSI Display Engine + PPA', zh: 'MIPI-DSI 顯示引擎 + PPA' },
    layer: { en: 'Physical Hardware Layer', zh: '實體硬件層 (Hardware Layer)' },
    type: 'Graphics Hardware Peripheral',
    tech: '2-Lane MIPI DSI + Hardware Blitter',
    role: { 
      en: 'Transmits high-speed video signals to handheld LCD/OLED screens with hardware image scaling.', 
      zh: '將高速視訊訊號傳輸至掌機 LCD/OLED 螢幕，並提供硬件圖像縮放。' 
    },
    details: { 
      en: 'Drives display frames directly from PSRAM double-buffers via DMA without burning CPU cycles.', 
      zh: '透過 DMA 直接從 PSRAM 雙緩衝區驅動顯示影格，無需佔用 CPU 運算資源。' 
    },
    memory: 'Hardware Subsystem',
    codeRef: 'ESP32-P4 Peripheral',
    color: 'blue',
    icon: Monitor
  },
  i2s_audio: {
    id: 'i2s_audio',
    name: { en: 'I2S Audio Peripheral & Codec', zh: 'I2S 音訊外設與 Codec 晶片' },
    layer: { en: 'Physical Hardware Layer', zh: '實體硬件層 (Hardware Layer)' },
    type: 'Audio Peripheral',
    tech: 'I2S Bus + ES8311 DAC Codec',
    role: { 
      en: 'Streams OpenLara sound effects and soundtrack PCM audio to external speakers or headphones.', 
      zh: '將 OpenLara 音效及原聲帶 PCM 音訊串流輸出至外部喇叭或耳機。' 
    },
    details: { 
      en: 'Uses continuous DMA ring buffers to prevent audio popping and clipping during frame drops.', 
      zh: '採用連續 DMA Ring Buffer，防止掉格時出現音訊爆音或斷音。' 
    },
    memory: 'Hardware Subsystem',
    codeRef: 'ESP32-P4 Peripheral',
    color: 'blue',
    icon: Volume2
  }
};

const BOOT_SEQUENCE = [
  {
    step: 1,
    title: { en: '1. First-Stage ROM Bootloader', zh: '1. 第一階段 ROM Bootloader' },
    timeLabel: '0 ms (Power On)',
    location: 'Internal Chip ROM (128KB)',
    execBy: 'Core 0 (Primary RISC-V @ 20MHz)',
    activeIds: ['riscv_cpu', 'espidf_hal'],
    metrics: { cpuFreq: '20 MHz (RTC Fast)', sramUsed: '16 KB', psramUsed: '0 MB', status: 'ROM Execution' },
    desc: {
      en: 'Chip powers on. Execution starts at hardware ROM address. It checks strapping pins (GPIO35) to verify flash boot mode, initializes basic SPI clocks, and reads second-stage bootloader binary from Flash offset 0x2000 into internal SRAM.',
      zh: '晶片通電。執行核心於硬件 ROM 位址開始運行。檢查 Strapping Pins (GPIO35) 以確認 Flash boot 模式，初始化基礎 SPI 時鐘，並從 Flash 偏移量 0x2000 將第二階段 Bootloader Binary 讀取至內部 SRAM。'
    },
    logs: [
      '[0.000] ESP-ROM:v1.0 (esp32p4)',
      '[0.002] Build:Nov 20 2023',
      '[0.005] rst:0x1 (POWERON),boot:0x28 (SPI_FAST_FLASH_BOOT)',
      '[0.010] Strapping pins GPIO35: HIGH (Flash boot mode detected)',
      '[0.018] SPI Speed: 80MHz, Mode: DIO, Clock: Internal',
      '[0.025] Reading 2nd stage bootloader from Flash offset 0x2000...',
      '[0.038] Copying 28KB payload into internal SRAM @ 0x40800000',
      '[0.040] Jumping to 2nd stage bootloader entry point...'
    ]
  },
  {
    step: 2,
    title: { en: '2. Second-Stage Bootloader', zh: '2. 第二階段 Bootloader' },
    timeLabel: '+42 ms',
    location: 'Internal SRAM (768KB)',
    execBy: 'Core 0 (Primary RISC-V @ 80MHz)',
    activeIds: ['riscv_cpu', 'freertos', 'espidf_hal'],
    metrics: { cpuFreq: '80 MHz', sramUsed: '64 KB', psramUsed: '0 MB', status: 'Partition Verification' },
    desc: {
      en: 'Boots from internal SRAM. Reads the Partition Table from Flash (offset 0x8000). Locates the active application partition (openlara firmware image) and maps Flash & PSRAM MMU pages.',
      zh: '從內部 SRAM 啟動。從 Flash (偏移量 0x8000) 讀取 Partition Table。定位主應用程序 Partition (openlara 韌體 Image) 並映射 Flash 及 PSRAM 的 MMU 頁面。'
    },
    logs: [
      '[0.042] boot: ESP-IDF v5.3-dev-8912 second-stage bootloader',
      '[0.048] boot: Min chip revision: v0.1',
      '[0.052] boot: Loading partition table at offset 0x8000',
      '[0.058] boot: Partition map: 0 app 00100000 00a00000 openlara_esp32p4',
      '[0.064] boot: Partition map: 1 nvs 00009000 00006000 data',
      '[0.071] boot: Verifying SHA256 image checksum... PASSED',
      '[0.082] boot: Mapping Flash MMU pages for application text/rodata',
      '[0.095] boot: Transferring control to application app_startup()'
    ]
  },
  {
    step: 3,
    title: { en: '3. App Startup & 32MB PSRAM Init', zh: '3. App Startup 與 32MB PSRAM 初始化' },
    timeLabel: '+110 ms',
    location: 'Flash / SRAM / External PSRAM',
    execBy: 'Core 0 & Core 1 (Dual RISC-V @ 400MHz)',
    activeIds: ['riscv_cpu', 'psram', 'freertos', 'app_main'],
    metrics: { cpuFreq: '400 MHz (Dual Core)', sramUsed: '128 KB', psramUsed: '32.0 MB Octal', status: 'Memory & RTOS Init' },
    desc: {
      en: 'Ramps RISC-V clock to 400 MHz. Initializes 32MB External PSRAM bus. Sets up C++ static objects, standard library C runtime, heap allocators (MALLOC_CAP_SPIRAM), and starts FreeRTOS dual-core scheduler.',
      zh: '將 RISC-V 時鐘提升至 400 MHz。初始化 32MB 外部 PSRAM 匯流排。設定 C++ 靜態物件、標準 C Runtime、Heap Allocator (MALLOC_CAP_SPIRAM)，並啟動 FreeRTOS 雙核排程器。'
    },
    logs: [
      '[0.110] cpu_start: Pro CPU up, App CPU up (Dual-Core RISC-V RV32IMAFCP)',
      '[0.118] cpu_start: Switching CPU frequency to maximum 400 MHz',
      '[0.125] psram: Octal/Hex PSRAM detected: 32 MB @ 200MHz bus',
      '[0.134] psram: Tested 32MB SPIRAM region [0x80000000 - 0x82000000] OK',
      '[0.142] heap_init: Initialized internal SRAM heap: 512 KB free',
      '[0.148] heap_init: Initialized SPIRAM heap: 32768 KB free',
      '[0.155] freertos: Starting FreeRTOS SMP scheduler on Core 0 & Core 1',
      '[0.160] freertos: Spawning app_main task on Core 0 (Priority 1)'
    ]
  },
  {
    step: 4,
    title: { en: '4. app_main() & Peripheral Launch', zh: '4. app_main() 與周邊驅動加載' },
    timeLabel: '+210 ms',
    location: 'FreeRTOS Task Context',
    execBy: 'Core 0 & Core 1 Tasks',
    activeIds: ['app_main', 'sd_card', 'mipi_dsi', 'i2s_audio', 'input_port', 'espidf_hal', 'riscv_cpu', 'psram', 'freertos'],
    metrics: { cpuFreq: '400 MHz', sramUsed: '256 KB', psramUsed: '1.2 MB', status: 'Hardware Drivers Ready' },
    desc: {
      en: 'FreeRTOS launches app_main(). Mounts SD card over SDMMC, configures MIPI-DSI & PPA hardware scaling, starts USB HID Host for gamepads, initializes I2S ES8311 sound, and prepares OpenLara memory pools.',
      zh: 'FreeRTOS 啟動 app_main() 任務。透過 SDMMC 掛載 SD Card，配置 MIPI-DSI 及 PPA 硬件縮放器，啟動 USB HID Host 支援手柄，初始化 I2S ES8311 音訊，並準備 OpenLara 記憶體池。'
    },
    logs: [
      '[0.210] openlara: [app_main] Initializing OpenLara ESP32-P4 platform layer...',
      '[0.225] openlara_sd: Mounting MicroSD Card via SDMMC (4-bit, 40MHz)... OK',
      '[0.240] openlara_sd: Mounted FAT32 volume at /sdcard',
      '[0.280] openlara_gfx: Initializing MIPI-DSI (800x480) & PPA Hardware Blitter... OK',
      '[0.310] openlara_gfx: Allocated double framebuffers in PSRAM (1.5 MB)',
      '[0.330] openlara_snd: Initializing I2S Audio Codec (ES8311, 44.1kHz Stereo)... OK',
      '[0.380] openlara_input: Starting USB Host HID driver for gamepad support...',
      '[0.400] openlara: [app_main] Platform drivers initialized successfully!'
    ]
  },
  {
    step: 5,
    title: { en: '5. OpenLara Engine & 3D Render Loop', zh: '5. OpenLara 引擎與 3D 渲染主循環' },
    timeLabel: '+450 ms (Active Engine)',
    location: 'OpenLara 3D Engine Thread',
    execBy: 'Core 0 (3D Raster) & Core 1 (Audio/Input)',
    activeIds: ['openlara_core', 'renderer', 'level_files', 'sd_card', 'display_port', 'input_port', 'freertos', 'espidf_hal', 'riscv_cpu', 'psram', 'mipi_dsi', 'i2s_audio'],
    metrics: { cpuFreq: '400 MHz (Dual Core)', sramUsed: '380 KB', psramUsed: '18.4 MB', status: '3D Loop @ 60 FPS' },
    desc: {
      en: 'Loads Tomb Raider level geometry (.PHD/.TR2) from MicroSD into PSRAM. Software 3D rasterizer calculates polygon vertices, camera position, entity AI, and hands off RGB frames to PPA blitter for screen output.',
      zh: '從 MicroSD 讀取 Tomb Raider 關卡幾何數據 (.PHD/.TR2) 至 PSRAM。軟件 3D Rasterizer 計算多邊形頂點、鏡頭位置、實體 AI，並將 RGB 影格交由 PPA Blitter 輸出至螢幕。'
    },
    logs: [
      '[0.450] openlara: Opening level file: /sdcard/DATA/LEVEL2.PHD',
      '[0.520] openlara: Reading level file into PSRAM (14.2 MB read)',
      '[0.580] openlara: Parsed 1,420 rooms, 4,890 3D meshes, 128 texture pages',
      '[0.610] openlara: Sound bank loaded (124 audio samples ready)',
      '[0.640] openlara: Launching 3D Software Rasterizer pipeline...',
      '[0.655] openlara: Render resolution: 320x240 -> PPA hardware scaled to 800x480',
      '[0.670] openlara: Game loop active! Target: 60 FPS. Processing user input...'
    ]
  }
];

const MEMORY_LAYOUT = [
  {
    name: 'Internal ROM (128 KB)',
    type: 'Read-Only Hardware Silicon',
    speed: 'Ultra High (Zero Latency)',
    usedFor: {
      en: 'First-stage bootloader code, basic chip flash drivers, cryptographic primitives.',
      zh: '第一階段 Bootloader 代碼、基礎晶片 Flash 驅動程式、密碼學原語 (Cryptographic Primitives)。'
    },
    color: 'bg-slate-700 border-slate-500 text-slate-200'
  },
  {
    name: 'Internal HP SRAM (768 KB)',
    type: 'On-Chip SRAM Memory',
    speed: 'High Speed (Bus Frequency)',
    usedFor: {
      en: 'FreeRTOS kernel stacks, critical DMA descriptors, second-stage bootloader execution, fast ISR routines.',
      zh: 'FreeRTOS 核心 Stack、關鍵 DMA Descriptor、第二階段 Bootloader 執行、高速 ISR 中斷服務例程。'
    },
    color: 'bg-purple-900/60 border-purple-500 text-purple-200'
  },
  {
    name: 'External SPI NOR Flash (16-32 MB)',
    type: 'Non-Volatile Storage (Off-Chip)',
    speed: 'Medium-High (Cache Mapped)',
    usedFor: {
      en: 'Compiled project binary, openlara_esp32p4 program code, read-only constant data, boot partition table.',
      zh: '已編譯的專案 Binary、openlara_esp32p4 程式碼、唯讀常數數據、Boot Partition Table。'
    },
    color: 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
  },
  {
    name: 'External PSRAM (32 MB HEX)',
    type: 'Volatile RAM (Off-Chip High Speed)',
    speed: 'High Speed (~200 MHz Octal/Hex)',
    usedFor: {
      en: 'CRITICAL FOR OPENLARA: Level 3D meshes, active textures, audio sample banks, double framebuffers, entity state.',
      zh: 'OPENLARA 核心關鍵：關卡 3D Mesh 多邊形、活躍貼圖集、音訊採樣庫、雙重 Framebuffer、實體狀態。'
    },
    color: 'bg-amber-900/60 border-amber-500 text-amber-200'
  }
];

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'zh'
  const [selectedComp, setSelectedComp] = useState(SYSTEM_COMPONENTS.openlara_core);
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture', 'boot', 'memory'
  const [activeBootStep, setActiveBootStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveBootStep((prev) => {
          if (prev >= BOOT_SEQUENCE.length) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentBootData = BOOT_SEQUENCE.find((s) => s.step === activeBootStep) || BOOT_SEQUENCE[0];

  const isComponentActiveInBoot = (compId) => {
    if (activeTab !== 'boot') return true;
    return currentBootData.activeIds.includes(compId);
  };

  const isZh = lang === 'zh';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3 flex flex-col gap-3">
        {/* Row 1: Title & Right-Aligned Language Switcher */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2">
                openlara_esp32p4
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  ESP32-P4 RISC-V Architecture
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {isZh 
                  ? '互動式硬件、固件 (Firmware)、操作系統及遊戲引擎架構探索器' 
                  : 'Interactive Hardware, Firmware, Operating System, and Engine Stack Explorer'}
              </p>
            </div>
          </div>

          {/* Language Toggle aligned to right */}
          <button
            onClick={() => setLang(isZh ? 'en' : 'zh')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            title="Toggle Language / 切換語言"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isZh ? 'English' : '繁體中文'}</span>
          </button>
        </div>

        {/* Row 2: Content Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => { setActiveTab('architecture'); setIsAutoPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isZh ? '系統架構' : 'System Stack'}
          </button>
          <button
            onClick={() => setActiveTab('boot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'boot'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isZh ? 'Boot 模擬器' : 'Boot Simulator'}
          </button>
          <button
            onClick={() => { setActiveTab('memory'); setIsAutoPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            {isZh ? '記憶體佈局' : 'Memory Layout'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: ARCHITECTURE STACK */}
        {activeTab === 'architecture' && (
          <>
            {/* Left Column: Stack Diagram (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Quick Specs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    {isZh ? '處理器 (Processor)' : 'Processor'}
                  </div>
                  <div className="text-sm font-semibold text-blue-400 mt-0.5">Dual RISC-V @ 400MHz</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    {isZh ? '遊戲 RAM' : 'Game RAM'}
                  </div>
                  <div className="text-sm font-semibold text-amber-400 mt-0.5">32 MB High-Speed PSRAM</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    {isZh ? 'OS 排程器' : 'OS Scheduler'}
                  </div>
                  <div className="text-sm font-semibold text-purple-400 mt-0.5">FreeRTOS SMP Core</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    {isZh ? '顯示管線' : 'Display Pipeline'}
                  </div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">MIPI-DSI + HW PPA Blitter</div>
                </div>
              </div>

              {/* Layer Stack Interactive Container */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-5 relative shadow-2xl space-y-5">
                
                {/* 1. LAYER: GAME ASSETS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      {isZh ? '1. 遊戲資源與外部存儲層 (Game Assets Layer)' : '1. Game Assets & External Storage Layer'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Physical SDMMC Bus</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[SYSTEM_COMPONENTS.sd_card, SYSTEM_COMPONENTS.level_files].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComp(item)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{item.name[lang] || item.name.en}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.tech}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* 2. LAYER: ENGINE CORE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5" />
                      {isZh ? '2. 遊戲引擎核心層 (Core Game Engine)' : '2. Core Game Engine (XProger OpenLara)'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Portable C++ Logic</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[SYSTEM_COMPONENTS.openlara_core, SYSTEM_COMPONENTS.renderer].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComp(item)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{item.name[lang] || item.name.en}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.tech}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* 3. LAYER: APPLICATION GLUE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      {isZh ? '3. 應用粘合層 (Application Glue Layer)' : '3. Application Glue Layer (openlara_esp32p4)'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">ESP-IDF Hardware Adaptation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[SYSTEM_COMPONENTS.app_main, SYSTEM_COMPONENTS.display_port, SYSTEM_COMPONENTS.input_port].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComp(item)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{item.name[lang] || item.name.en}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.tech}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* 4. LAYER: OS & FRAMEWORK */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5" />
                      {isZh ? '4. 操作系統與 ESP-IDF 框架層' : '4. OS & ESP-IDF Framework Layer'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Real-Time Core</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[SYSTEM_COMPONENTS.freertos, SYSTEM_COMPONENTS.espidf_hal].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComp(item)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/10 scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-purple-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{item.name[lang] || item.name.en}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.tech}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

                {/* 5. LAYER: PHYSICAL HARDWARE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      {isZh ? '5. 實體硬件層 (ESP32-P4 SoC 與周邊外設)' : '5. Physical Hardware Layer (ESP32-P4 SoC & Peripherals)'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Silicon & Board Components</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[SYSTEM_COMPONENTS.riscv_cpu, SYSTEM_COMPONENTS.psram, SYSTEM_COMPONENTS.mipi_dsi, SYSTEM_COMPONENTS.i2s_audio].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComp(item)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/10 scale-[1.01]'
                              : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-blue-400'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 truncate">{item.name[lang] || item.name.en}</div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.tech}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Component Inspector */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    {isZh ? '元件檢視器 (Inspector)' : 'Component Inspector'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {selectedComp.layer[lang] || selectedComp.layer.en}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      {selectedComp.name[lang] || selectedComp.name.en}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">{selectedComp.type}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      {isZh ? '核心職責 (Core Role)' : 'Core Role'}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedComp.role[lang] || selectedComp.role.en}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">{isZh ? '技術規格:' : 'Technical Specs:'}</span>
                      <span className="font-mono text-slate-200 font-medium">{selectedComp.tech}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">{isZh ? '記憶體分配:' : 'Memory Allocation:'}</span>
                      <span className="font-mono text-amber-300 font-medium">{selectedComp.memory}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400">{isZh ? '原始碼位置:' : 'Source Location:'}</span>
                      <span className="font-mono text-cyan-300 font-medium">{selectedComp.codeRef}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-200">{isZh ? '架構細節: ' : 'Architectural Detail: '}</span>
                    {selectedComp.details[lang] || selectedComp.details.en}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>{isZh ? '目標平台: ESP32-P4' : 'Target Platform: ESP32-P4'}</span>
                    <span>{isZh ? '狀態: 運作中' : 'Status: Active'}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BOOT SIMULATOR */}
        {activeTab === 'boot' && (
          <div className="lg:col-span-12 space-y-6">
            
            {/* Top Control Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    {isZh ? '互動式分步 Boot 啟動流程視覺化工具' : 'Interactive Step-by-Step Boot Sequence Visualizer'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isZh 
                      ? '觀察 ESP32-P4 通電啟動時，硬件組件、Bootloader 階段與驅動程式的加載過程。' 
                      : 'Watch how hardware components, bootloader stages, and drivers activate as the ESP32-P4 powers up.'}
                  </p>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveBootStep(1)}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition"
                    title={isZh ? '重置 Boot 流程' : 'Reset Boot Sequence'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      isAutoPlaying
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400'
                    }`}
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAutoPlaying 
                      ? (isZh ? '暫停模擬' : 'Pause Simulation') 
                      : (isZh ? '自動播放 Boot' : 'Auto-Play Boot')}
                  </button>

                  <button
                    disabled={activeBootStep === 1}
                    onClick={() => { setIsAutoPlaying(false); setActiveBootStep((prev) => Math.max(1, prev - 1)); }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-medium rounded-lg text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                  >
                    {isZh ? '上一步' : 'Prev'}
                  </button>
                  <button
                    disabled={activeBootStep === BOOT_SEQUENCE.length}
                    onClick={() => { setIsAutoPlaying(false); setActiveBootStep((prev) => Math.min(BOOT_SEQUENCE.length, prev + 1)); }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-medium rounded-lg text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                  >
                    {isZh ? '下一步' : 'Next'}
                  </button>
                </div>
              </div>

              {/* Step Progress Stepper Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {BOOT_SEQUENCE.map((s) => {
                  const isActive = activeBootStep === s.step;
                  const isPast = activeBootStep > s.step;
                  const stepTitle = s.title[lang] || s.title.en;
                  return (
                    <button
                      key={s.step}
                      onClick={() => { setIsAutoPlaying(false); setActiveBootStep(s.step); }}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : isPast
                          ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-300'
                          : 'bg-slate-950/80 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          isActive ? 'bg-cyan-500 text-slate-950' : isPast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          STEP 0{s.step}
                        </span>
                        <span className="text-slate-400">{s.timeLabel}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 truncate">{stepTitle.split('. ')[1]}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.metrics.status}</div>

                      {/* Active Indicator Pulse */}
                      {isActive && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Visual Map */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
                    {isZh ? '即時動態組件拓撲圖 (Topology Map)' : 'Live Active Component Topology Map'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Step {currentBootData.step} / {BOOT_SEQUENCE.length} Active
                  </span>
                </div>

                {/* Layer Blocks */}
                <div className="space-y-3 text-xs">
                  
                  {/* Layer 1 */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      {isZh ? '1. 遊戲存儲與檔案' : '1. Game Storage & Files'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[SYSTEM_COMPONENTS.sd_card, SYSTEM_COMPONENTS.level_files].map((c) => {
                        const active = isComponentActiveInBoot(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`p-2.5 rounded-lg border transition-all duration-300 ${
                              active
                                ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 text-amber-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between text-xs">
                              <span className="truncate">{c.name[lang] || c.name.en}</span>
                              <span className={`text-[9px] px-1 rounded font-mono ${active ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
                                {active ? 'ACTIVE' : 'OFF'}
                              </span>
                            </div>
                            <div className="text-[10px] opacity-80 mt-0.5 truncate">{c.tech}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {isZh ? '2. 核心引擎 (OpenLara)' : '2. Core Engine (OpenLara)'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[SYSTEM_COMPONENTS.openlara_core, SYSTEM_COMPONENTS.renderer].map((c) => {
                        const active = isComponentActiveInBoot(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`p-2.5 rounded-lg border transition-all duration-300 ${
                              active
                                ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/10 text-cyan-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between text-xs">
                              <span className="truncate">{c.name[lang] || c.name.en}</span>
                              <span className={`text-[9px] px-1 rounded font-mono ${active ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
                                {active ? 'ACTIVE' : 'OFF'}
                              </span>
                            </div>
                            <div className="text-[10px] opacity-80 mt-0.5 truncate">{c.tech}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      {isZh ? '3. 應用粘合移植層' : '3. Application Glue Porting'}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[SYSTEM_COMPONENTS.app_main, SYSTEM_COMPONENTS.display_port, SYSTEM_COMPONENTS.input_port].map((c) => {
                        const active = isComponentActiveInBoot(c.id);
                        const cName = c.name[lang] || c.name.en;
                        return (
                          <div
                            key={c.id}
                            className={`p-2 rounded-lg border transition-all duration-300 ${
                              active
                                ? 'bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/10 text-emerald-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40'
                            }`}
                          >
                            <div className="font-bold text-[11px] flex items-center justify-between">
                              <span className="truncate">{cName.split(' ')[0]}</span>
                              <span className={`text-[8px] px-1 rounded font-mono ${active ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
                                {active ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 4 */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                      {isZh ? '4. 操作系統與排程層' : '4. OS & Scheduler Layer'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[SYSTEM_COMPONENTS.freertos, SYSTEM_COMPONENTS.espidf_hal].map((c) => {
                        const active = isComponentActiveInBoot(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`p-2.5 rounded-lg border transition-all duration-300 ${
                              active
                                ? 'bg-purple-500/20 border-purple-400 shadow-md shadow-purple-500/10 text-purple-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between text-xs">
                              <span className="truncate">{c.name[lang] || c.name.en}</span>
                              <span className={`text-[9px] px-1 rounded font-mono ${active ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
                                {active ? 'ACTIVE' : 'OFF'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 5 */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                      {isZh ? '5. ESP32-P4 SoC 晶片' : '5. ESP32-P4 SoC Silicon'}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[SYSTEM_COMPONENTS.riscv_cpu, SYSTEM_COMPONENTS.psram, SYSTEM_COMPONENTS.mipi_dsi, SYSTEM_COMPONENTS.i2s_audio].map((c) => {
                        const active = isComponentActiveInBoot(c.id);
                        const cName = c.name[lang] || c.name.en;
                        return (
                          <div
                            key={c.id}
                            className={`p-2 rounded-lg border transition-all duration-300 ${
                              active
                                ? 'bg-blue-500/20 border-blue-400 shadow-md shadow-blue-500/10 text-blue-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40'
                            }`}
                          >
                            <div className="font-bold text-[11px] truncate">{cName.split(' ')[0]}</div>
                            <span className={`text-[8px] px-1 py-0.2 rounded font-mono inline-block mt-1 ${active ? 'bg-blue-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}`}>
                              {active ? 'BUS ACTIVE' : 'SLEEP'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Terminal & Resource Monitor */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Resource Monitor */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-emerald-400" />
                      Step {currentBootData.step} {isZh ? '資源監控器' : 'Resource Monitor'}
                    </span>
                    <span className="text-emerald-400 font-bold">{currentBootData.timeLabel}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">{isZh ? 'CPU 頻率' : 'CPU Frequency'}</div>
                      <div className="font-mono text-cyan-300 font-bold mt-0.5">{currentBootData.metrics.cpuFreq}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">{isZh ? '內部 SRAM' : 'Internal SRAM'}</div>
                      <div className="font-mono text-purple-300 font-bold mt-0.5">{currentBootData.metrics.sramUsed}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">{isZh ? '外部 PSRAM' : 'External PSRAM'}</div>
                      <div className="font-mono text-amber-300 font-bold mt-0.5">{currentBootData.metrics.psramUsed}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">{isZh ? '執行核心' : 'Executed By'}</div>
                      <div className="font-mono text-emerald-300 font-bold mt-0.5 truncate">{currentBootData.execBy.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>

                {/* Narrative Explanation */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    {currentBootData.title[lang] || currentBootData.title.en}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentBootData.desc[lang] || currentBootData.desc.en}
                  </p>
                </div>

                {/* Simulated UART Serial Terminal */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      ESP32-P4 UART0 Terminal Output (115200 baud)
                    </span>
                    <span className="text-slate-500">Live Serial Console</span>
                  </div>

                  <div className="bg-black/90 p-3 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1 h-48 overflow-y-auto border border-slate-900 select-text">
                    {currentBootData.logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-slate-600 select-none">&gt;</span>
                        <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('OK') || log.includes('PASSED') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 3: MEMORY LAYOUT */}
        {activeTab === 'memory' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  {isZh ? 'ESP32-P4 記憶體層級與分配地圖 (Memory Map)' : 'ESP32-P4 Memory Hierarchy & Allocation Map'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isZh 
                    ? '了解高速內部 SRAM 與大容量外部 PSRAM 在 Tomb Raider 關卡數據上的分工與記憶體映射。' 
                    : 'How memory domains are divided between fast internal SRAM and high-capacity external PSRAM for Tomb Raider assets.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEMORY_LAYOUT.map((mem, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${mem.color} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-100">{mem.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950/60 rounded border border-slate-700 text-slate-300">
                        {mem.speed}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-mono">{mem.type}</div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-900 text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-sans block mb-1 font-semibold">
                        {isZh ? '主要分配區域:' : 'Primary Allocation Domain:'}
                      </span>
                      {mem.usedFor[lang] || mem.usedFor.en}
                    </div>
                  </div>
                ))}
              </div>

              {/* PSRAM Importance Box */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-300">
                    {isZh ? '為什麼 32MB 外部 PSRAM 對 OpenLara 至關重要：' : 'Why 32MB External PSRAM is Essential for OpenLara:'}
                  </span>
                  {isZh ? (
                    'Tomb Raider 關卡 (.PHD 檔案) 包含完整 3D 幾何 Mesh、音訊庫、動畫影格及高解析度貼圖集。內部 SRAM (768 KB) 只能容納 OS 核心 Stack 及 DMA Descriptor。幾乎所有引擎動態 Heap 分配 (`malloc`) 都必須透過 ESP-IDF 的 `MALLOC_CAP_SPIRAM` 指向外部 PSRAM。'
                  ) : (
                    'Tomb Raider levels (.PHD files) contain full 3D geometry meshes, sound banks, animation frames, and high-resolution textures. Internal SRAM (768 KB) can only fit OS kernel stacks and DMA descriptors. Almost all engine dynamic heap allocations (`malloc`) must target external PSRAM via ESP-IDF\'s `MALLOC_CAP_SPIRAM`.'
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 px-6 py-4 text-center text-xs text-slate-500">
        <p>openlara_esp32p4 System Architecture & Interactive Boot Simulator • Created for Espressif ESP32-P4 RISC-V SoC</p>
      </footer>
    </div>
  );
}

/**
 * Mẫu nhà cung cấp AI Toonflow
 * @version 2.0
 */

// ============================================================
// Định nghĩa kiểu
// ============================================================

type VideoMode =
  | "singleImage" //Tham chiếu một ảnh
  | "startEndRequired" //Khung đầu-cuối (bắt buộc 2 ảnh)
  | "endFrameOptional" //Khung đầu-cuối (khung cuối tùy chọn)
  | "startFrameOptional" //Khung đầu-cuối (khung đầu tùy chọn)
  | "text" //Văn bản
  | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[]; //Đa tham chiếu (số = giới hạn)

interface TextModel {
  name: string;
  modelName: string;
  type: "text";
  think: boolean;
}

interface ImageModel {
  name: string;
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
  associationSkills?: string;
}

interface VideoModel {
  name: string;
  modelName: string;
  type: "video";
  mode: VideoMode[];
  associationSkills?: string;
  audio: "optional" | false | true;
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string;
  modelName: string;
  type: "tts";
  voices: { title: string; voice: string }[];
}

interface VendorConfig {
  id: string; //唯一ID，作为文件名存储用户磁盘上，禁止符号
  version: string; //版本号，格式为x.y，需遵守语义化版本控制
  name: string; //供应商名称
  author: string; //作者
  description?: string; //描述，支持Markdown格式
  icon?: string; //图标，仅支持Base64格式，建议尺寸为128x128像素
  inputs: { key: string; label: string; type: "text" | "password" | "url"; required: boolean; placeholder?: string }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel | TTSModel)[];
}

type ReferenceList =
  | { type: "image"; sourceType: "base64"; base64: string }
  | { type: "audio"; sourceType: "base64"; base64: string }
  | { type: "video"; sourceType: "base64"; base64: string };

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<ReferenceList, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  referenceList?: ReferenceList[];
  audio?: boolean;
  mode: VideoMode[];
}

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
  referenceList?: Extract<ReferenceList, { type: "audio" }>[];
}

interface PollResult {
  completed: boolean;
  data?: string;
  error?: string;
}

// ============================================================
// Khai báo toàn cục
// ============================================================

declare const axios: any; // Thư viện HTTP
declare const logger: (msg: string) => void; // Hàm log
declare const jsonwebtoken: any; // Thư viện JWT
declare const zipImage: (base64: string, size: number) => Promise<string>; // Nén ảnh, trả base64 có header
declare const zipImageResolution: (base64: string, w: number, h: number) => Promise<string>; // Đổi độ phân giải ảnh, trả base64 có header
declare const mergeImages: (base64Arr: string[], maxSize?: string) => Promise<string>; // Ghép ảnh, trả base64 có header
declare const urlToBase64: (url: string) => Promise<string>; // URL sang Base64, trả base64 có header
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>; // Poll: fn async, interval, timeout
declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createMinimax: any;
declare const createGoogleGenerativeAI: any;
declare const exports: {
  vendor: VendorConfig;
  textRequest: (m: TextModel) => any; //Văn bản模型
  imageRequest: (c: ImageConfig, m: ImageModel) => Promise<string>; //Model ảnh, trả base64 có header
  videoRequest: (c: VideoConfig, m: VideoModel) => Promise<string>; //Model video, trả base64 có header
  ttsRequest: (c: TTSConfig, m: TTSModel) => Promise<string>; //(chưa mở) Model TTS, trả base64 có header
  checkForUpdates?: () => Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }>; //Kiểm tra cập nhật (Markdown notice)
  updateVendor?: () => Promise<string>; //更新函数，返回最新的代码Văn bản
};

// ============================================================
// Cấu hình vendor
// ============================================================

const vendor: VendorConfig = {
  id: "bull",
  version: "2.0",
  author: "Toonflow",
  name: "Mẫu trống",
  description: "## OpenAI标准格式接口，可修改Base URL并手动添加模型。",
  inputs: [
    { key: "apiKey", label: "API Key", type: "password", required: true },
    { key: "baseUrl", label: "Base URL", type: "url", required: true, placeholder: "VD: https://api.openai.com/v1" },
  ],
  inputValues: { apiKey: "", baseUrl: "https://api.openai.com/v1" },
  models: [{ name: "GPT-4o", modelName: "gpt-4o", type: "text", think: false }],
};

// ============================================================
// Hàm adapter
// ============================================================

const textRequest = (model: TextModel) => {
  if (!vendor.inputValues.apiKey) throw new Error("Thiếu API Key");
  const apiKey = vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
  return createOpenAI({ baseURL: vendor.inputValues.baseUrl, apiKey }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  return "";
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  return "";
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "2.0", notice: "## Thông báo phiên bản mới" };
};

const updateVendor = async (): Promise<string> => {
  return "";
};

// ============================================================
// Export
// ============================================================

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

// export {} để file được coi là module
export {};

/**
 * ============================================================
 * Hướng dẫn sinh mã AI
 * ============================================================
 *
 * 【Tổng quan】
 * File mẫu adapter vendor AI Toonflow。AI 在生成新供应商适配代码时，
 * 必须严格遵守以下规则，并要求用户提供目标平台的 curl 调用示例或 API 文档信息作为输入依据。
 *
 * 【前置要求】
 * 在生成代码前，请向用户索要以下信息（至少其一）：
 *   1. 目标 API 的 curl 请求示例（包含Base URL、Headers、Body 结构、响应结构）
 *   2. 目标 API 的官方文档链接或文档截图/Văn bản内容
 *   3. 需要适配的模型类型（text / image / video / tts）及其能力说明
 * 没有足够信息时，应主动追问，不要凭空编造 API 结构。
 *
 * 【代码规则】
 *
 * 1. 禁止引入任何外部包
 *    不可使用 import / require，仅能使用本文件「Khai báo toàn cục」区域中已声明的方法和对象，
 *    包括：axios、logger、jsonwebtoken、zipImage、zipImageResolution、mergeImages、
 *    urlToBase64、pollTask，以及 createOpenAI、createDeepSeek、createZhipu、createQwen、
 *    createAnthropic、createOpenAICompatible、createXai、createMinimax、
 *    createGoogleGenerativeAI 等 AI SDK 工厂函数。
 *
 * 2. 禁止在 exports.* 函数外部声明离散的全大写常量
 *    错误示例：const API_URL = "https://..."; const MAX_RETRY = 3;
 *    如果确实需要可配置的常量值，必须将其声明在 vendor.inputValues 中，
 *    通过 vendor.inputValues.xxx 访问，让用户可在界面上配置。
 *    如果是纯逻辑内部使用的临时变量，应内联在对应的 exports.* 函数体内部，使用小驼峰命名。
 *
 * 3. 逻辑尽量聚合在 exports.* 对应的函数内部
 *    每个适配函数（textRequest / imageRequest / videoRequest / ttsRequest）
 *    应自包含，将请求构造、发送、轮询、结果解析等逻辑写在函数体内，避免拆分出大量外部辅助函数。
 *    如果多个函数确实存在公共逻辑（如签名计算、Token 生成、请求头构造），
 *    可提取为文件内的小驼峰命名函数，放在「Hàm adapter」区块之前的「辅助工具」区块中，
 *    且不可使用全大写命名。
 *
 * 4. 命名规范
 *    所有变量、函数一律使用小驼峰命名（camelCase），禁止使用 UPPER_SNAKE_CASE。
 *
 * 5. 不需要重新声明类型
 *    本文件顶部已完整定义了所有接口和类型（VendorConfig、ImageConfig、VideoConfig、
 *    TTSConfig、TextModel、ImageModel、VideoModel、TTSModel、ReferenceList、PollResult 等），
 *    AI 生成代码时直接使用即可，不要重复声明。
 *
 * 6. 返回值规范
 *    - textRequest(model)：返回 AI SDK 的 chat model 实例（通过 createOpenAI 等工厂函数创建）。
 *    - imageRequest(config, model)：返回有头 base64 字符串（如 "data:image/png;base64,..."）。
 *      config.referenceList 为 Extract<ReferenceList, { type: "image" }>[] 类型，
 *      每个引用条目均为 base64 形式（sourceType 固定为 "base64"）。
 *    - videoRequest(config, model)：返回有头 base64 字符串（如 "data:video/mp4;base64,..."）。
 *      config.referenceList 为 ReferenceList[] 类型，可包含 image / video / audio 三种引用，
 *      每个引用条目均为 base64 形式（sourceType 固定为 "base64"）。
 *      config.mode 为当前激活的视频模式数组，需根据 mode 决定如何使用 referenceList。
 *    - ttsRequest(config, model)：返回有头 base64 字符串（如 "data:audio/mp3;base64,..."）。
 *      config.referenceList 为 Extract<ReferenceList, { type: "audio" }>[] 类型（音频参考）。
 *    当 API 返回的是 URL 而非二进制数据时，使用 urlToBase64(url) 转换。
 *
 * 7. ReferenceList 与 VideoMode 说明
 *    ReferenceList 是统一的多媒体引用类型，每个条目包含：
 *      - type: "image" | "audio" | "video"（媒体类型）
 *      - sourceType: "base64"（当前模板固定为 base64）
 *      - base64（对应的数据）
 *
 *    VideoMode 定义了视频模型支持的输入模式：
 *      - "text"：纯Văn bản生成视频
 *      - "singleImage"：单张首帧图片
 *      - "startEndRequired"：首尾帧（两张都必须提供）
 *      - "endFrameOptional"：Khung đầu-cuối (khung cuối tùy chọn)
 *      - "startFrameOptional"：Khung đầu-cuối (khung đầu tùy chọn)
 *      - 数组形式如 ["imageReference:9", "videoReference:3", "audioReference:3"]：
 *        多模态参考模式，数字表示该类型的最大数量限制。
 *
 *    在 videoRequest 中，config.mode 表示当前选择的模式，需根据其值决定：
 *      - 如何从 config.referenceList 中提取对应类型的引用
 *      - 如何构造 API 请求体中的图片/视频/音频参数
 *
 * 8. 异步任务处理
 *    对于视频生成等需要轮询的异步任务，使用全局的 pollTask 函数：
 *    const result = await pollTask(async () => {
 *      const resp = await axios.get(...);
 *      if (resp.data.status === "SUCCESS") return { completed: true, data: resp.data.url };
 *      if (resp.data.status === "FAILED") return { completed: true, error: resp.data.message };
 *      return { completed: false };
 *    }, 5000, 600000); // 每5秒轮询，10分钟超时
 *    if (result.error) throw new Error(result.error);
 *    return await urlToBase64(result.data!);
 *
 * 9. 错误处理
 *    在每个函数开头校验必需参数（如 API Key），缺失时使用 throw new Error("...") 抛出。
 *    API 请求失败时，从响应中提取有意义的错误信息抛出，不要吞掉异常。
 *
 * 10. 日志输出
 *     在关键步骤使用 logger("...") 输出日志（如"开始提交任务"、"任务ID: xxx"、"轮询中..."），
 *     便于调试。
 *
 * 11. vendor 配置填写
 *     - id：纯英文小写，作为文件名使用，禁止特殊符号和空格。
 *     - version：语义化版本格式 "x.y"。
 *     - inputs：根据目标 API 所需的认证信息配置（API Key、Secret、Base URL等）。
 *     - models：根据目标平台支持的模型列表填写，注意正确设置 type 和各模型特有字段。
 *       - VideoModel 的 mode 对应 API 支持的输入模式（参见规则 7 的 VideoMode 说明）。
 *       - VideoModel 的 audio 字段：true（始终生成音频）、false（不生成）、"optional"（用户可选）。
 *       - VideoModel 的 durationResolutionMap 对应各时长下可选的分辨率。
 *       - VideoModel 的 associationSkills 可选，用于描述模型的特殊能力。
 *       - ImageModel 的 mode 对应 API 支持的生图模式（"text" 纯Văn bản、"singleImage" Tham chiếu một ảnh、"multiReference" 多图参考）。
 *       - TTSModel 的 voices 对应可选的音色列表。
 *
 * 12. 图片处理
 *     - 需要压缩图片体积时使用 zipImage(base64, maxSizeKB)。
 *     - 需要调整图片分辨率时使用 zipImageResolution(base64, width, height)。
 *     - 需要将多张图片拼合为一张时使用 mergeImages(base64Arr, maxSize)。
 *     - 以上函数均接收和返回有头 base64 字符串。
 *
 * 13. 文件结构
 *     生成的代码必须保持本模板的整体结构：
 *     Định nghĩa kiểu区 → Khai báo toàn cục区 → Cấu hình vendor区 → [辅助工具区（可选）] → Hàm adapter区 → Export区
 *     不要打乱顺序，不要删除已有的结构注释分隔线。
 *     辅助工具区用于放置多个Hàm adapter共享的小驼峰命名辅助函数（如 getHeaders、getBaseUrl）。
 *
 * 14. Export规范
 *     必须Export以下字段（通过 exports.xxx = xxx 赋值）：
 *       - exports.vendor（必须）
 *       - exports.textRequest（必须）
 *       - exports.imageRequest（必须）
 *       - exports.videoRequest（必须）
 *       - exports.ttsRequest（必须）
 *       - exports.checkForUpdates（可选）
 *       - exports.updateVendor（可选）
 *     未实现的Hàm adapter保留空实现（return ""），不可省略Export。
 *     文件末尾必须包含 export {}; 以确保文件被识别为模块。
 *
 * 【生成流程】
 * 当用户请求生成新的供应商适配时：
 *   1. 确认用户已提供 curl 示例或 API 文档。
 *   2. 分析 API 的认证方式、端点地址、请求/响应结构。
 *   3. 基于本模板结构，填充 vendor 配置和对应的Hàm adapter。
 *   4. 根据当前模板的 ReferenceList 定义，按 base64 形式构造和消费 referenceList。
 *   5. 仅实现用户需要的模型类型，未用到的函数保留空实现（return ""）。
 *   6. 生成完整可用的代码，确保无语法错误、无遗漏Export。
 */

import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number; // 최대 파일 크기 (MB)
  maxWidthOrHeight?: number; // 최대 가로/세로 픽셀
  useWebWorker?: boolean; // 웹 워커 사용 여부
}

/**
 * 모바일 디바이스 감지
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 모바일 환경에 맞는 압축 옵션
 */
export function getMobileCompressionOptions(): CompressionOptions {
  return {
    maxSizeMB: 0.5, // 모바일은 더 작은 크기
    maxWidthOrHeight: 1280, // 모바일은 더 작은 해상도
    useWebWorker: true,
  };
}

/**
 * 데스크톱 환경에 맞는 압축 옵션
 */
export function getDesktopCompressionOptions(): CompressionOptions {
  return {
    maxSizeMB: 1, // 최대 1MB
    maxWidthOrHeight: 1920, // 최대 1920px
    useWebWorker: true,
  };
}

/**
 * 이미지를 압축하는 함수
 * @param file 원본 이미지 파일
 * @param options 압축 옵션 (지정하지 않으면 디바이스에 맞게 자동 선택)
 * @returns 압축된 이미지 파일
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  // 옵션이 없으면 디바이스에 맞게 자동 선택
  const defaultOptions = options || (isMobileDevice() 
    ? getMobileCompressionOptions() 
    : getDesktopCompressionOptions());

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    console.log(
      `압축 완료: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
    );
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    // 압축 실패 시 원본 파일 반환
    return file;
  }
}

/**
 * 이미지 파일 크기 확인 (MB 단위)
 */
export function getFileSizeMB(file: File): number {
  return file.size / 1024 / 1024;
}

/**
 * 이미지 미리보기 URL 생성
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

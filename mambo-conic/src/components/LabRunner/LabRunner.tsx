import { useEffect, useRef, useState, useCallback } from 'react';

interface LabRunnerProps {
  labType: string;
  step?: number;
  config?: any;
  onReady?: () => void;
  onResult?: (data: any) => void;
}

const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 600;

export function LabRunner({
  labType,
  step,
  config,
  onReady,
  onResult
}: LabRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const scaleX = containerWidth / LOGICAL_WIDTH;
    const scaleY = containerHeight / LOGICAL_HEIGHT;
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
  }, []);

  useEffect(() => {
    calculateScale();
    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateScale]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('[LabRunner] 收到消息:', event.data);
      console.log('[LabRunner] 消息来源:', event.origin);
      if (!event.data || !event.data.type) {
        console.log('[LabRunner] 消息格式不正确，忽略');
        return;
      }
      const { type, payload } = event.data;
      switch (type) {
        case 'LAB_READY':
          console.log('[LabRunner] ✅ 收到 LAB_READY，移除加载状态');
          setIsLoading(false);
          onReady?.();
          break;
        case 'LAB_RESULT':
          console.log('[LabRunner] 收到 LAB_RESULT:', payload);
          onResult?.(payload);
          break;
        default:
          console.log('[LabRunner] 未知消息类型:', type);
          break;
      }
    };
    console.log('[LabRunner] 注册 message 监听器');
    window.addEventListener('message', handleMessage);
    return () => {
      console.log('[LabRunner] 移除 message 监听器');
      window.removeEventListener('message', handleMessage);
    };
  }, [onReady, onResult]);

  useEffect(() => {
    // 减少延迟，加快配置发送
    const timeout = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        console.log('[LabRunner] 发送 LAB_CONFIG:', config);
        iframeRef.current.contentWindow.postMessage({
          type: 'LAB_CONFIG',
          payload: config
        }, '*');
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [config, labType]);

  const iframeUrl = `/labs/${labType}/index.html`;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">加载实验中...</p>
          </div>
        </div>
      )}
      <div
        style={{
          width: LOGICAL_WIDTH,
          height: LOGICAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out'
        }}
      >
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          width={LOGICAL_WIDTH}
          height={LOGICAL_HEIGHT}
          style={{
            border: 'none',
            display: 'block'
          }}
          title={`Lab: ${labType}`}
          onLoad={() => {
            console.log('iframe loaded, waiting for LAB_READY message');
            // 添加超时保护：如果5秒内没收到LAB_READY，强制移除加载状态
            setTimeout(() => {
              if (isLoading) {
                console.warn('LAB_READY message timeout, forcing ready state');
                setIsLoading(false);
                onReady?.();
              }
            }, 5000);
          }}
        />
      </div>
    </div>
  );
}

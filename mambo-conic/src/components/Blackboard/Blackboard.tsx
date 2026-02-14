import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import type { BlackboardContent } from '../../types/blackboard.types';
import { blackboardLogger } from '../../utils/logger';
import { LabRunner } from '../LabRunner';

interface BlackboardProps {
  content?: BlackboardContent;
}

export function Blackboard({ content }: BlackboardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  // 当 content 变化时重置图片错误状态
  useEffect(() => {
    setImgError(null);
  }, [content]);

  useEffect(() => {
    blackboardLogger.debug('Content 更新, type:', content?.type, 'labType:', content?.type === 'lab' ? content.labType : 'N/A');
    if (content?.type === 'video' && videoRef.current) {
      if (content.autoplay) {
        videoRef.current.play();
      }
    }
  }, [content]);

  if (!content) {
    blackboardLogger.debug('暂无黑板内容');
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>暂无黑板内容</p>
      </div>
    );
  }

  switch (content.type) {
    case 'image':
      blackboardLogger.debug('渲染图片:', content.src);
      if (imgError) {
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>图片加载失败: {imgError}</p>
          </div>
        );
      }
      return (
        <img
          src={content.src}
          alt={content.alt || '黑板图片'}
          className={content.className || 'w-full h-full object-contain'}
          style={content.style}
          onError={() => {
            blackboardLogger.warn('图片加载失败:', content.src);
            setImgError(content.src);
          }}
        />
      );

    case 'video':
      blackboardLogger.debug('渲染视频:', content.src);
      return (
        <video
          ref={videoRef}
          src={content.src}
          autoPlay={content.autoplay}
          loop={content.loop}
          controls
          className={content.className || 'w-full h-full object-contain'}
          style={content.style}
        />
      );

    case 'math':
      blackboardLogger.debug('渲染数学公式');
      return (
        <div className={content.className || 'w-full h-full flex items-center justify-center'} style={content.style}>
          <BlockMath math={content.content} errorColor="#cc0000" />
        </div>
      );

    case 'lab':
      blackboardLogger.debug('渲染实验, labType:', content.labType, 'fixedMode:', content.config?.fixedMode);
      return (
        <LabRunner
          labType={content.labType}
          step={content.step}
          config={content.config}
        />
      );

    case 'iframe':
      blackboardLogger.debug('渲染外部iframe:', content.src);
      return (
        <iframe
          src={content.src}
          className={content.className || 'w-full h-full'}
          style={{ border: 'none', ...content.style }}
          title="外部实验"
          allowFullScreen
        />
      );

    default:
      blackboardLogger.warn('未知的黑板类型:', content.type);
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>未知的黑板类型</p>
        </div>
      );
  }
}

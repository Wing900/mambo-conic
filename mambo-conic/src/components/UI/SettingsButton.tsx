import { useGameStore } from '../../store/useGameStore';

export default function SettingsButton() {
  const { isAudioEnabled, toggleAudio } = useGameStore();

  return (
    <button
      onClick={toggleAudio}
      className="p-2 rounded-full hover:bg-black/5 transition-colors"
      title={isAudioEnabled ? "关闭声音" : "开启声音"}
    >
      <span className="text-xl filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        {isAudioEnabled ? '🔊' : '🔇'}
      </span>
    </button>
  );
}

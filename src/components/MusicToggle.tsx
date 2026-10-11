import { siteUrl } from '../utils/paths';
import { useInteractionSounds } from '../hooks/useInteractionSounds';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Primitives';

const MUSIC_VOLUME = 0.035;
const STORAGE_KEY = 'cozy-music';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const desired = useRef(true);
  const silenceInteractions = useInteractionSounds(desired);
  const blocked = useRef(false);
  const request = useRef(0);
  const savedTime = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [host] = useState(() => document.createElement('div'));

  const save = () => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          playing: desired.current,
          time: audioRef.current?.currentTime || savedTime.current,
        }),
      );
    } catch {
      /* Playback still works when storage is unavailable. */
    }
  };
  const play = async () => {
    const audio = audioRef.current;
    if (!audio || document.hidden) return;
    const id = ++request.current;
    try {
      await audio.play();
      if (id !== request.current) return;
      blocked.current = false;
      setFailed(false);
    } catch (error) {
      if (id !== request.current) return;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        blocked.current = true;
      } else if (
        !(error instanceof DOMException && error.name === 'AbortError')
      ) {
        setFailed(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current!;
    audio.volume = MUSIC_VOLUME;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        desired.current = saved.playing !== false;
        savedTime.current = Number.isFinite(saved.time)
          ? Math.max(0, saved.time)
          : 0;
      }
    } catch {
      /* Start with default playback intent. */
    }
    const restore = () => {
      if (
        savedTime.current &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        audio.currentTime = savedTime.current % audio.duration;
        savedTime.current = 0;
      }
    };
    audio.addEventListener('loadedmetadata', restore);
    if (audio.readyState >= 1) restore();
    if (desired.current) void play();
    const visibility = () => {
      if (document.hidden) {
        ++request.current;
        save();
        audio.pause();
      } else if (desired.current && !blocked.current && !audio.error) {
        void play();
      }
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', save);
    audio.addEventListener('timeupdate', save);
    return () => {
      save();
      ++request.current;
      audio.pause();
      audio.removeEventListener('loadedmetadata', restore);
      audio.removeEventListener('timeupdate', save);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', save);
    };
  }, []);

  useEffect(() => {
    // Move only the portal host into the modal top layer; the audio stays mounted.
    const place = () => {
      const parent = document.querySelector('dialog[open]') || document.body;
      if (host.parentElement !== parent) parent.appendChild(host);
    };
    place();
    const observer = new MutationObserver(place);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['open'],
    });
    return () => {
      observer.disconnect();
      host.remove();
    };
  }, [host]);

  const toggleMusic = () => {
    const audio = audioRef.current!;
    if (!audio.paused) {
      desired.current = false;
      silenceInteractions();
      ++request.current;
      audio.pause();
      save();
      return;
    }
    desired.current = true;
    blocked.current = false;
    if (failed) {
      savedTime.current = audio.currentTime || savedTime.current;
      audio.load();
      setFailed(false);
    }
    save();
    void play();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={siteUrl('/assets/audio/cozy-theme.mp3')}
        preload="auto"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setFailed(true);
          setIsPlaying(false);
        }}
      />
      {createPortal(
        <button
          type="button"
          className={`icon-button music-button${isPlaying ? ' is-playing' : ''}`}
          onClick={toggleMusic}
          aria-label={
            failed
              ? 'Retry background music'
              : isPlaying
                ? 'Mute music and interaction sounds'
                : 'Play music and enable interaction sounds'
          }
          aria-pressed={isPlaying}
        >
          <span
            className={`music-button__state${!failed && isPlaying ? ' is-visible' : ''}`}
          >
            <Icon name="sound-on" />
          </span>
          <span
            className={`music-button__state${!failed && !isPlaying ? ' is-visible' : ''}`}
          >
            <Icon name="sound-off" />
          </span>
          <span className={`music-button__state${failed ? ' is-visible' : ''}`}>
            <Icon name="refresh" />
          </span>
        </button>,
        host,
      )}
    </>
  );
}

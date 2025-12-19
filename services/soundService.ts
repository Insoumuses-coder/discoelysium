
class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  // Tiny 1s MP3 placeholders (Simulated with short base64 sequences or silent-ish blocks for brevity, 
  // but implemented as synthesized sounds to guarantee the exact "detective" tone requested)
  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (!mute && this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTypewriter() {
    if (this.isMuted) return;
    this.initContext();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx!.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.1);
  }

  playNeonBuzz() {
    if (this.isMuted) return;
    this.initContext();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, this.ctx!.currentTime); // 60Hz hum
    
    gain.gain.setValueAtTime(0.02, this.ctx!.currentTime);
    // Add flicker
    gain.gain.linearRampToValueAtTime(0.01, this.ctx!.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.03, this.ctx!.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.2);
  }

  playPaperTear() {
    if (this.isMuted) return;
    this.initContext();
    const bufferSize = this.ctx!.sampleRate * 0.3; // 300ms
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx!.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx!.currentTime + 0.3);
    
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.15, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx!.destination);
    
    noise.start();
  }
}

export const soundService = new SoundService();

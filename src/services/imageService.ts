// services/imageService.ts
import { GameImage } from '@/types/game';
import { mockImages } from '@/data/mockImages';

interface ImageSearchParams {
  query?: string;
  count?: number;
  page?: number;
}

export class ImageService {
  private unsplashKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  private pexelsKey = process.env.PEXELS_API_KEY;
  private replicateToken = process.env.REPLICATE_API_TOKEN;
  private leonardoKey = process.env.LEONARDO_API_KEY;
  private stabilityKey = process.env.STABILITY_API_KEY || process.env.STABILITY_API_TOKEN;
  private aiPrompts = [
    'hyper-realistic portrait photography, dramatic lighting, 85mm lens',
    'futuristic cityscape at dusk, cinematic lighting, ultra detailed',
    'macro photograph of a colorful insect on a leaf, depth of field',
    'surreal dreamscape with floating islands and waterfalls, 8k',
    'photo of a street fashion model in Tokyo, neon lights, bokeh',
    'wildlife photo of a snow leopard in the mountains, golden hour',
    'close-up portrait of an elderly person with expressive eyes, soft light',
    'professional food photography of gourmet dessert, studio lighting',
  ];
  private realFallbackQueries = ['nature', 'city skyline', 'street photography', 'portrait', 'architecture'];

  /**
   * Fetch real images from Unsplash
   */
  async fetchRealImages(params: ImageSearchParams = {}): Promise<GameImage[]> {
    if (!this.unsplashKey) {
      console.warn('Unsplash API key not configured');
      return [];
    }

    const { query = 'nature,portrait,street', count = 10 } = params;
    const url = `https://api.unsplash.com/photos/random?count=${count}&query=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${this.unsplashKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      interface UnsplashPhoto {
        id: string;
        urls: {
          regular?: string;
          small?: string;
          full?: string;
        };
        user: {
          name: string;
        };
      }
      
      const data: UnsplashPhoto[] = await response.json();
      
      return data
        .filter(photo => photo.urls.regular || photo.urls.small || photo.urls.full)
        .map((photo) => ({
          id: `unsplash_${photo.id}`,
          url: photo.urls.regular || photo.urls.small || photo.urls.full || '',
          isAI: false,
          source: 'Unsplash',
          credits: `Photo by ${photo.user.name}`,
          photographer: photo.user.name,
        }));
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  }

  /**
   * Fetch real images from Pexels
   */
  async fetchRealImagesFromPexels(params: ImageSearchParams = {}): Promise<GameImage[]> {
    if (!this.pexelsKey) {
      console.warn('Pexels API key not configured');
      return [];
    }

    const { query = 'nature,people', count = 10 } = params;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: this.pexelsKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      interface PexelsPhoto {
        id: number;
        src: {
          medium?: string;
          large?: string;
          original?: string;
        };
        photographer: string;
      }
      
      interface PexelsResponse {
        photos: PexelsPhoto[];
      }
      
      const data: PexelsResponse = await response.json();
      
      return data.photos
        .filter(photo => photo.src.medium || photo.src.large || photo.src.original)
        .map((photo) => ({
          id: `pexels_${photo.id}`,
          url: photo.src.medium || photo.src.large || photo.src.original || '',
          isAI: false,
          source: 'Pexels',
          credits: `Photo by ${photo.photographer}`,
          photographer: photo.photographer,
        }));
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
      return [];
    }
  }

  /**
   * Fetch real images from Picsum as a fallback when API keys are missing
   */
  private async fetchFallbackRealImages(count: number): Promise<GameImage[]> {
    if (count <= 0) return [];

    const page = Math.floor(Math.random() * 50) + 1;
    const url = `https://picsum.photos/v2/list?page=${page}&limit=${count}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Picsum API error: ${response.status}`);
      }

      interface PicsumPhoto {
        id: string;
        download_url: string;
        author: string;
      }

      const data: PicsumPhoto[] = await response.json();

      return data.map((photo) => ({
        id: `picsum_${photo.id}`,
        url: photo.download_url,
        isAI: false,
        source: 'Picsum',
        credits: `Photo by ${photo.author}`,
        photographer: photo.author,
      }));
    } catch (error) {
      console.error('Error fetching fallback real images from Picsum:', error);
      return [];
    }
  }

  /**
   * Generate AI images using Replicate
   * Note: This would typically require a model ID and prompt
   */
  async fetchAIImagesFromReplicate(params: ImageSearchParams = {}): Promise<GameImage[]> {
    // Note: Replicate API requires specific model and prompt
    // For now, we'll simulate AI images by fetching from public sources
    if (!this.replicateToken) {
      console.warn('Replicate API token not configured');
      return [];
    }

    // In a real implementation, we'd generate images with Replicate
    // For now, we'll return placeholder images with AI markers
    try {
      // This is a simplified approach - in reality, you'd call:
      // const prediction = await this.replicate.predictions.create({...});
      
      // Return placeholder images
      return Array(params.count || 5).fill(null).map((_, index) => ({
        id: `replicate_${Date.now()}_${index}`,
        url: `https://source.unsplash.com/800x800/?ai-generated,art,${index}`,
        isAI: true,
        source: 'Replicate',
        credits: 'AI Generated',
        model: 'Replicate Model',
      }));
    } catch (error) {
      console.error('Error with Replicate service:', error);
      return [];
    }
  }

  /**
   * Generate AI images using Leonardo
   */
  async fetchAIImagesFromLeonardo(params: ImageSearchParams = {}): Promise<GameImage[]> {
    if (!this.leonardoKey) {
      console.warn('Leonardo API key not configured');
      return [];
    }

    try {
      // In a real implementation, you'd call the Leonardo API to generate images
      // For now, we'll return placeholder images
      return Array(params.count || 5).fill(null).map((_, index) => ({
        id: `leonardo_${Date.now()}_${index}`,
        url: `https://source.unsplash.com/800x800/?digital-art,${index}`,
        isAI: true,
        source: 'Leonardo',
        credits: 'AI Generated',
        model: 'Leonardo AI',
      }));
    } catch (error) {
      console.error('Error with Leonardo service:', error);
      return [];
    }
  }

  /**
   * Fetch AI imagery from the Midjourney public Explore feed
   */
  async fetchAIImagesFromMidjourney(params: ImageSearchParams = {}): Promise<GameImage[]> {
    const { count = 10 } = params;
    const exploreUrl = 'https://www.midjourney.com/explore';

    try {
      const response = await fetch(exploreUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Midjourney Explore request failed with status ${response.status}`);
      }

      const html = await response.text();
      const sanitized = html
        .replace(/\u002F/g, '/')
        .replace(/\\\//g, '/');
      const imageUrlRegex = /https:\/\/cdn\.midjourney\.com\/[A-Za-z0-9\-\/_]+\.(?:png|jpg|jpeg|gif|webp|avif)/gi;
      const rawMatches = sanitized.match(imageUrlRegex) ?? [];
      const uniqueUrls = Array.from(
        new Set(
          rawMatches.map((url) => url.replace(/\?.*$/, ''))
        )
      );

      return uniqueUrls.slice(0, count).map((url, index) => {
        const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(url)
        return {
          id: `midjourney_${Date.now()}_${index}`,
          url,
          isAI: true,
          source: 'Midjourney Community',
          credits: 'Image courtesy of the Midjourney public gallery',
          model: 'Midjourney',
          mediaType: isVideo ? 'video' : 'image',
        }
      });
    } catch (error) {
      console.error('Error fetching Midjourney images:', error);
      return [];
    }
  }

  /**
   * Fetch AI imagery from the Stability AI public gallery endpoint
   */
  async fetchAIImagesFromStableDiffusion(params: ImageSearchParams = {}): Promise<GameImage[]> {
    if (!this.stabilityKey) {
      console.warn('Stability API key not configured');
      return [];
    }

    const { count = 10, page = 1 } = params;
    const perPage = Math.min(Math.max(count, 1), 50);
    const galleryUrl = new URL('https://api.stability.ai/v2beta/stable-diffusion-3/gallery');
    galleryUrl.searchParams.set('page', page.toString());
    galleryUrl.searchParams.set('per_page', perPage.toString());

    try {
      const response = await fetch(galleryUrl.toString(), {
        headers: {
          Authorization: `Bearer ${this.stabilityKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Stability AI gallery request failed with status ${response.status}`);
      }

      interface StabilityGalleryCreator {
        username?: string;
        profile_url?: string;
      }

      interface StabilityGalleryImage {
        id?: string;
        url?: string;
        prompt?: string;
        model?: string;
        gallery_url?: string;
        creator?: StabilityGalleryCreator;
      }

      interface StabilityGalleryResponse {
        images?: StabilityGalleryImage[];
      }

      const data: StabilityGalleryResponse = await response.json();
      const images = data.images ?? [];

      return images
        .filter((image): image is StabilityGalleryImage & { url: string } => Boolean(image.url))
        .slice(0, count)
        .map((image, index) => {
          const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(image.url)
          return {
            id: `stability_${image.id ?? `${Date.now()}_${index}`}`,
            url: image.url,
            isAI: true,
            source: 'Stability AI Gallery',
            credits: image.creator?.username
              ? `Creator: ${image.creator.username}`
              : 'Image courtesy of the Stability AI community gallery',
            model: image.model ?? 'Stable Diffusion',
            mediaType: isVideo ? 'video' : 'image',
          }
        });
    } catch (error) {
      console.error('Error fetching Stable Diffusion images:', error);
      return [];
    }
  }

  /**
   * Generate AI-style images using the Pollinations API (no key required)
   * COMMENTED OUT: Disabled to only show Midjourney and Mage.space images
   */
  // async fetchAIImagesFromPollinations(params: ImageSearchParams = {}): Promise<GameImage[]> {
  //   const { count = 10 } = params;
  //   const images: GameImage[] = [];

  //   for (let i = 0; i < count; i++) {
  //     const prompt = this.aiPrompts[Math.floor(Math.random() * this.aiPrompts.length)];
  //     const seed = `${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
  //     const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}`;

  //     images.push({
  //       id: `pollinations_${seed}`,
  //       url,
  //       isAI: true,
  //       source: 'Pollinations AI',
  //       credits: `Prompt: ${prompt}`,
  //       model: 'Pollinations',
  //     });
  //   }

  //   return images;
  // }

  /**
   * Fetch mixed images (real and AI) from all available sources
   */
  async fetchMixedImages(count: number = 20): Promise<GameImage[]> {
    const desiredRealCount = Math.max(1, Math.floor(count / 2));
    const desiredAiCount = Math.max(1, count - desiredRealCount);

    const realImages: GameImage[] = [];

    // Try Unsplash first
    const unsplashImages = await this.fetchRealImages({ count: desiredRealCount });
    realImages.push(...unsplashImages);

    // If we still need more real images, try Pexels
    if (realImages.length < desiredRealCount) {
      const remaining = desiredRealCount - realImages.length;
      const pexelsImages = await this.fetchRealImagesFromPexels({ count: remaining });
      realImages.push(...pexelsImages);
    }

    // Fallback to Picsum if API keys are missing
    if (realImages.length < desiredRealCount) {
      const remaining = desiredRealCount - realImages.length;
      const fallbackReal = await this.fetchFallbackRealImages(remaining);
      realImages.push(...fallbackReal);
    }

    const aiImages: GameImage[] = [];

    // Start with Midjourney community gallery imagery
    const midjourneyImages = await this.fetchAIImagesFromMidjourney({ count: desiredAiCount });
    aiImages.push(...midjourneyImages);

    // Pull additional AI images from the Stability AI public gallery when available
    if (aiImages.length < desiredAiCount) {
      const remaining = desiredAiCount - aiImages.length;
      const stabilityImages = await this.fetchAIImagesFromStableDiffusion({ count: remaining });
      aiImages.push(...stabilityImages);
    }

    // COMMENTED OUT: Pollinations fallback disabled - only using Midjourney and Mage.space
    // if (aiImages.length < desiredAiCount) {
    //   const remaining = desiredAiCount - aiImages.length;
    //   const pollinationImages = await this.fetchAIImagesFromPollinations({ count: remaining });
    //   aiImages.push(...pollinationImages);
    // }

    // If Replicate is configured, include those images too
    if (aiImages.length < desiredAiCount) {
      const remaining = desiredAiCount - aiImages.length;
      const replicateImages = await this.fetchAIImagesFromReplicate({ count: remaining });
      aiImages.push(...replicateImages);
    }

    // Leonardo fallback if configured
    if (aiImages.length < desiredAiCount) {
      const remaining = desiredAiCount - aiImages.length;
      const leonardoImages = await this.fetchAIImagesFromLeonardo({ count: remaining });
      aiImages.push(...leonardoImages);
    }

    // Absolute fallback to in-memory mock images to ensure the UI always has content
    if (aiImages.length < desiredAiCount) {
      aiImages.push(...this.getFallbackImages(true, desiredAiCount - aiImages.length));
    }

    if (realImages.length < desiredRealCount) {
      realImages.push(...this.getFallbackImages(false, desiredRealCount - realImages.length));
    }

    const combined = [...realImages, ...aiImages];

    if (combined.length < count) {
      combined.push(...this.getFallbackImages(undefined, count - combined.length));
    }

    return this.shuffleArray(combined).slice(0, count);
  }

  /**
   * Helper to shuffle an array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  /**
   * Helper to get fallback images from the mock dataset
   */
  private getFallbackImages(filterIsAI: boolean | undefined, count: number): GameImage[] {
    if (count <= 0) return [];

    const pool = filterIsAI === undefined
      ? mockImages
      : mockImages.filter((image) => image.isAI === filterIsAI);

    if (pool.length === 0) return [];

    const shuffled = this.shuffleArray(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((image) => ({
      ...image,
      id: `${image.id}_fallback_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    }));
  }
}

export const imageService = new ImageService();

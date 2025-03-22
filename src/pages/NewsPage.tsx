import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MessageSquare, Loader2 } from "lucide-react";
import axios from "axios";

interface NewsItemProps {
  id: number;
  title: string;
  summary: string;
  date: string;
  source: string;
  category: string;
  comments: number;
  saved: boolean;
  image: string;
}

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5001/api/news");

        if (response.data && response.data.results) {
          // Transform API data to match our NewsItemProps structure
          const transformedNews = response.data.results.map(
            (item: any, index: number) => {
              // Extract domain from source URL for the source name
              const sourceDomain =
                item.source?.domain || item.source?.title || "News Source";

              // Map API categories to our categories
              const getCategoryFromTags = (currencies: any[], tags: any[]) => {
                // Check if related to Avalanche first
                const isAvax = currencies?.some(
                  (c: any) =>
                    c.code?.toLowerCase() === "avax" ||
                    c.title?.toLowerCase().includes("avalanche")
                );

                if (isAvax) return "Protocol";

                // Otherwise map based on tags
                if (
                  tags?.some((t: any) => t.title?.toLowerCase().includes("defi"))
                )
                  return "DeFi";
                if (
                  tags?.some((t: any) => t.title?.toLowerCase().includes("nft"))
                )
                  return "NFTs";
                if (
                  tags?.some((t: any) => t.title?.toLowerCase().includes("governance"))
                )
                  return "Governance";

                // Default category
                return ["Protocol", "DeFi", "NFTs", "Governance"][
                  Math.floor(Math.random() * 4)
                ];
              };

              // Create a date string from published_at (could be formatted better)
              const dateStr = item.published_at
                ? new Date(item.published_at).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];

              // Use reliable stock photos for crypto/blockchain news
              const stockImages = [
                "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
                "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80",
                "https://images.unsplash.com/photo-1639322537133-5fcead339c3a?w=800&q=80",
                "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80",
                "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80",
                "https://images.unsplash.com/photo-1518544866329-94b8a14b10e2?w=800&q=80",
                "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
                "https://images.unsplash.com/photo-1566227675319-2a25c246ee8a?w=800&q=80",
              ];

              const imageIndex = index % stockImages.length;
              const imageUrl = stockImages[imageIndex];

              return {
                id: index + 1,
                title: item.title || "Crypto News Update",
                summary:
                  item.body ||
                  item.description ||
                  "News update from the cryptocurrency world.",
                date: dateStr,
                source: sourceDomain,
                category: getCategoryFromTags(item.currencies, item.tags),
                comments: Math.floor(Math.random() * 50), // Mock comment count
                saved: false, // Default to not saved
                image: imageUrl,
              };
            }
          );

          setNewsItems(transformedNews);
        } else {
          // Fallback to mock data if API response is invalid
          setNewsItems(defaultNewsItems);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Using cached data.");
        // Fallback to mock data
        setNewsItems(defaultNewsItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on search query
  const getFilteredNews = () => {
    // First apply search filter
    const searchFiltered = searchQuery
      ? newsItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : newsItems;

    return searchFiltered;
  };

  const filteredNews = getFilteredNews();

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="protocol" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews
                .filter((item) => item.category === "Protocol")
                .map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="defi" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews
                .filter((item) => item.category === "DeFi")
                .map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews
                .filter((item) => item.category === "NFTs")
                .map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="governance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews
                .filter((item) => item.category === "Governance")
                .map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const NewsCard = ({ item }: { item: NewsItemProps }) => {
  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="line-clamp-2 text-lg">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                item.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </a>
          </CardTitle>
          <Badge variant="outline" className="ml-2 shrink-0">
            {item.category}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{item.date}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
            {item.source}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{item.summary}</p>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{item.comments} comments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Add a fallback mock data
const defaultNewsItems = [
  {
    id: 1,
    title: "Avalanche Foundation Launches $50M Culture Catalyst Initiative",
    summary:
      "The Avalanche Foundation has announced a $50 million fund to accelerate the growth of arts, entertainment, and social experiences in the Avalanche ecosystem.",
    date: "2023-06-15",
    source: "Avalanche Blog",
    category: "Protocol",
    comments: 24,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
  },
  {
    id: 2,
    title: "Avalanche Warp Messaging Goes Live on Mainnet",
    summary:
      "Avalanche Warp Messaging (AWM) is now live on mainnet, enabling native communication between subnets without bridges or oracles.",
    date: "2023-05-28",
    source: "Avalanche Blog",
    category: "DeFi",
    comments: 42,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80",
  },
  {
    id: 3,
    title:
      "Avalanche Partners with Major Financial Institution for Tokenization",
    summary:
      "A leading global financial institution has selected Avalanche for its asset tokenization platform, citing the network's high throughput and low fees.",
    date: "2023-05-10",
    source: "CoinDesk",
    category: "NFTs",
    comments: 18,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80",
  },
  {
    id: 4,
    title: "Avalanche Summit 2023 Dates Announced",
    summary:
      "The annual Avalanche Summit will take place in Barcelona from September 12-15, bringing together developers, entrepreneurs, and investors from across the ecosystem.",
    date: "2023-04-22",
    source: "Avalanche Foundation",
    category: "Governance",
    comments: 7,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80",
  },
  {
    id: 5,
    title: "New Avalanche Upgrade Improves Cross-Subnet Communication",
    summary:
      "The latest Avalanche network upgrade enhances cross-subnet communication, enabling more efficient data sharing between different application-specific blockchains.",
    date: "2023-04-05",
    source: "Avalanche Blog",
    category: "DeFi",
    comments: 31,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1639322537133-5fcead339c3a?w=800&q=80",
  },
  {
    id: 6,
    title: "Avalanche's Core Protocol Breakthrough: Achieving 10,000 TPS",
    summary:
      "Ava Labs researchers announce a major breakthrough in Avalanche's consensus protocol, enabling transaction throughput of up to 10,000 TPS without compromising security or decentralization.",
    date: "2023-07-12",
    source: "Crypto News",
    category: "Protocol",
    comments: 53,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1518544866329-94b8a14b10e2?w=800&q=80",
  },
  {
    id: 7,
    title: "Avalanche Foundation Expands Developer Grants Program to $25M",
    summary:
      "The Avalanche Foundation has expanded its developer grants program to $25 million, aiming to accelerate growth of the ecosystem by supporting innovative projects building on Avalanche.",
    date: "2023-08-03",
    source: "Avalanche Forum",
    category: "Governance",
    comments: 14,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
  },
  {
    id: 8,
    title:
      "JPMorgan's Onyx Platform to Integrate with Avalanche for Settlement",
    summary:
      "Global banking giant JPMorgan announces plans to integrate its Onyx digital assets platform with Avalanche blockchain for faster and more efficient cross-border settlement services.",
    date: "2023-08-17",
    source: "Financial Times",
    category: "DeFi",
    comments: 39,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1566227675319-2a25c246ee8a?w=800&q=80",
  },
  {
    id: 9,
    title:
      "Avalanche Virtual Machine (AVM) 2.0 Unveiled at Developer Conference",
    summary:
      "Ava Labs reveals the next generation of the Avalanche Virtual Machine at their annual developer conference, featuring improved smart contract capabilities, reduced gas fees, and enhanced compatibility with existing tools.",
    date: "2023-09-01",
    source: "Decrypt",
    category: "Protocol",
    comments: 27,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80",
  },
  {
    id: 10,
    title: "Avalanche-Based DeFi Protocol Surpasses $2B in Total Value Locked",
    summary:
      "A leading decentralized finance protocol built on Avalanche has reached a significant milestone, exceeding $2 billion in total value locked (TVL), showcasing growing confidence in Avalanche's DeFi ecosystem.",
    date: "2023-09-12",
    source: "DeFi Pulse",
    category: "DeFi",
    comments: 16,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
  },
  {
    id: 11,
    title: "Avalanche NFT Collection 'Snowflakes' Sells Out in Record Time",
    summary:
      "A new NFT collection on Avalanche named 'Snowflakes' featuring unique generative art sold out in just 12 minutes, demonstrating the growing interest in Avalanche's NFT ecosystem.",
    date: "2023-09-15",
    source: "NFT Insider",
    category: "NFTs",
    comments: 22,
    saved: false,
    image:
      "https://images.unsplash.com/photo-1616696589765-1b43ce0e891c?w=800&q=80",
  },
];

export default NewsPage;

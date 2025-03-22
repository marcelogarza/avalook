import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { FileQuestion, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: string;
  summary: string;
  url: string;
}

interface NewsFeedSectionProps {
  news?: NewsItem[];
}

const NewsFeedSection = ({ news: propNews }: NewsFeedSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If news is provided as props, use it directly
    if (propNews && propNews.length > 0) {
      setNews(propNews);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5001/api/news");

        if (response.data && response.data.results) {
          // Transform API data to match our NewsItem structure
          const transformedNews = response.data.results
            .slice(0, 5) // Limit to 5 news items for the dashboard
            .map((item: any, index: number) => {
              // Extract domain from source URL for the source name
              const sourceDomain =
                item.source?.domain || item.source?.title || "News Source";

              // Determine time ago string
              const getTimeAgo = (published_at: string) => {
                if (!published_at) return "Recently";

                const date = new Date(published_at);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

                if (diffHrs < 1) return "Just now";
                if (diffHrs < 24) return `${diffHrs}h ago`;
                const diffDays = Math.floor(diffHrs / 24);
                return `${diffDays}d ago`;
              };

              // Sanitize and truncate summary text
              const getSanitizedSummary = (text: string) => {
                if (!text) return "News update from the cryptocurrency world.";
                // Remove any HTML tags that might be in the content
                const sanitized = text.replace(/<[^>]*>?/gm, "");
                // Truncate to a reasonable length for summary
                return sanitized.length > 200
                  ? sanitized.substring(0, 200) + "..."
                  : sanitized;
              };

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
                  tags?.some((t: any) =>
                    t.title?.toLowerCase().includes("defi")
                  )
                )
                  return "DeFi";
                if (
                  tags?.some((t: any) => t.title?.toLowerCase().includes("nft"))
                )
                  return "NFTs";
                if (
                  tags?.some((t: any) =>
                    t.title?.toLowerCase().includes("governance")
                  )
                )
                  return "Governance";

                // Default category
                return ["Protocol", "DeFi", "NFTs", "Governance"][
                  Math.floor(Math.random() * 4)
                ];
              };

              return {
                id: `${index + 1}`,
                title: item.title || "Crypto News Update",
                source: sourceDomain,
                date: getTimeAgo(item.published_at),
                category: getCategoryFromTags(item.currencies, item.tags),
                summary: getSanitizedSummary(item.body || item.description),
                url: item.url || "#",
              };
            });

          setNews(transformedNews);
        } else {
          // Fallback to default news if API response is invalid
          setNews(defaultNews);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news");
        // Fallback to default data
        setNews(defaultNews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [propNews]);

  const getFilteredNews = () => {
    if (activeCategory === "all") {
      return news;
    } else {
      return news.filter(
        (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
  };

  const filteredNews = getFilteredNews();

  return (
    <Card
      className="w-full bg-base-100 shadow-sm border border-base-300 flex flex-col"
      style={{ height: "500px" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          Avalanche News
        </CardTitle>
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1 pb-0">
        <div className="space-y-4 overflow-y-auto" style={{ height: "365px" }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-base-content/70">
                Loading news...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-center text-base-content/70">{error}</p>
            </div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-base-content/70">
              <FileQuestion className="h-16 w-16 mb-4" />
              <p className="text-center">No news found for this category</p>
            </div>
          )}
        </div>

        <div className="border-t border-base-300 mt-2 bg-base-100">
          <Link to="/news" className="block w-full">
            <button className="w-full h-10 py-2 text-center text-sm text-primary hover:text-primary-focus font-medium">
              View All News
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsCardProps) => {
  // Truncate long titles
  const truncateTitle = (title: string, maxLength = 70) => {
    if (!title) return "Crypto News Update";
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  return (
    <div className="p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-base-content line-clamp-2">
          <a
            href={
              item.url && item.url !== "#"
                ? item.url
                : `https://www.google.com/search?q=${encodeURIComponent(
                    item.title
                  )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {truncateTitle(item.title)}
          </a>
        </h3>
        <Badge
          variant="outline"
          className="text-xs whitespace-nowrap ml-2 flex-shrink-0"
        >
          {item.category}
        </Badge>
      </div>
      <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
        {item.summary}
      </p>
      <div className="flex items-center text-xs text-base-content/70">
        <span className="truncate max-w-[80px]">{item.source}</span>
        <span className="mx-1">•</span>
        <span>{item.date}</span>
      </div>
    </div>
  );
};

const defaultNews: NewsItem[] = [
  {
    id: "1",
    title:
      "Avalanche Subnet Toolkit Launches to Accelerate Blockchain Development",
    source: "Avalanche Blog",
    date: "2h ago",
    category: "Protocol",
    summary:
      "Ava Labs releases new developer toolkit to simplify subnet deployment and management, enabling faster blockchain application development on Avalanche.",
    url: "#",
  },
  {
    id: "2",
    title: "Major DeFi Protocol Migrates from Ethereum to Avalanche",
    source: "DeFi Pulse",
    date: "5h ago",
    category: "DeFi",
    summary:
      "Leading DeFi lending platform announces full migration to Avalanche citing lower fees and faster transaction times as primary motivators.",
    url: "#",
  },
  {
    id: "3",
    title: "Avalanche Foundation Announces $100M Ecosystem Fund",
    source: "CoinDesk",
    date: "1d ago",
    category: "Protocol",
    summary:
      "New ecosystem fund aims to support projects building on Avalanche with grants, technical support, and marketing resources.",
    url: "#",
  },
  {
    id: "4",
    title: "NFT Marketplace Sets New Volume Record on Avalanche",
    source: "NFT Insider",
    date: "2d ago",
    category: "NFT",
    summary:
      "Leading Avalanche NFT marketplace reports record-breaking 24-hour trading volume of $25M, signaling growing interest in the ecosystem.",
    url: "#",
  },
  {
    id: "5",
    title: "Avalanche Governance Proposal AIP-44 Passes with 92% Approval",
    source: "Avalanche Forum",
    date: "3d ago",
    category: "Governance",
    summary:
      "Community approves proposal to enhance validator rewards structure, aiming to increase network security and decentralization.",
    url: "#",
  },
  {
    id: "6",
    title: "Avalanche's Core Protocol Achieves New Performance Milestone",
    source: "Crypto News",
    date: "4d ago",
    category: "Protocol",
    summary:
      "Ava Labs researchers demonstrate Avalanche consensus reaching 10,000 TPS in controlled environment tests, setting new standard for blockchain performance.",
    url: "#",
  },
  {
    id: "7",
    title: "JPMorgan Partners with Avalanche for Asset Tokenization",
    source: "Financial Times",
    date: "6d ago",
    category: "DeFi",
    summary:
      "Global banking leader JPMorgan announces integration of its Onyx platform with Avalanche to enable institutional-grade asset tokenization services.",
    url: "#",
  },
  {
    id: "8",
    title:
      "Avalanche Virtual Machine 2.0 Promises Major Developer Improvements",
    source: "Decrypt",
    date: "1w ago",
    category: "Protocol",
    summary:
      "The next generation Avalanche VM brings reduced gas fees, enhanced smart contract capabilities, and better compatibility with existing development tools.",
    url: "#",
  },
  {
    id: "9",
    title: "Top DeFi Protocol on Avalanche Surpasses $2B in TVL",
    source: "DeFi Pulse",
    date: "1w ago",
    category: "DeFi",
    summary:
      "Major decentralized finance platform built on Avalanche celebrates milestone as total value locked exceeds $2 billion, signaling growing ecosystem strength.",
    url: "#",
  },
  {
    id: "10",
    title: "Avalanche Foundation Expands Developer Grants to $25M",
    source: "Avalanche Forum",
    date: "2w ago",
    category: "Governance",
    summary:
      "The Avalanche Foundation increases its developer grants program to $25 million to support innovative teams building on the Avalanche ecosystem.",
    url: "#",
  },
];

export default NewsFeedSection;

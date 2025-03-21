import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ExternalLink, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

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

const NewsFeedSection = ({ news = defaultNews }: NewsFeedSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredNews =
    activeCategory === "all"
      ? news
      : news.filter(
          (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <Card
      className="w-full h-full bg-base-100 shadow-sm border border-base-300 flex flex-col"
      style={{ minHeight: "500px" }}
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
            <TabsTrigger value="nft">NFTs</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-4 h-[400px] overflow-y-auto">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-base-content/70">
              <FileQuestion className="h-16 w-16 mb-4" />
              <p className="text-center">No news found for this category</p>
            </div>
          )}
        </div>

        <div className="border-t border-base-300 mt-4">
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
  return (
    <div className="p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-base-content">{item.title}</h3>
        <Badge variant="outline" className="text-xs">
          {item.category}
        </Badge>
      </div>
      <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
        {item.summary}
      </p>
      <div className="flex justify-between items-center text-xs text-base-content/70">
        <div className="flex items-center gap-2">
          <span>{item.source}</span>
          <span>•</span>
          <span>{item.date}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
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
];

export default NewsFeedSection;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, ExternalLink } from "lucide-react";

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
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Avalanche News</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search news..." className="pl-8" />
          </div>
        </div>
        <CardDescription>
          Latest updates from the Avalanche ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="nft">NFTs</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2"
          >
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent
            value="protocol"
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2"
          >
            {news
              .filter((item) => item.category === "Protocol")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </TabsContent>

          <TabsContent
            value="defi"
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2"
          >
            {news
              .filter((item) => item.category === "DeFi")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </TabsContent>

          <TabsContent
            value="nft"
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2"
          >
            {news
              .filter((item) => item.category === "NFT")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </TabsContent>

          <TabsContent
            value="governance"
            className="space-y-4 max-h-[280px] overflow-y-auto pr-2"
          >
            {news
              .filter((item) => item.category === "Governance")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsCardProps) => {
  return (
    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{item.title}</h3>
        <Badge variant="outline" className="text-xs">
          {item.category}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {item.summary}
      </p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
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

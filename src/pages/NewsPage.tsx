import React from "react";
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
import {
  Search,
  Calendar,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Avalanche Foundation Launches $50M Culture Catalyst Initiative",
    summary:
      "The Avalanche Foundation has announced a $50 million fund to accelerate the growth of arts, entertainment, and social experiences in the Avalanche ecosystem.",
    date: "2023-06-15",
    source: "Avalanche Blog",
    category: "Ecosystem",
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
    category: "Technology",
    comments: 42,
    saved: true,
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
    category: "Partnerships",
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
    category: "Events",
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
    category: "Technology",
    comments: 31,
    saved: true,
    image:
      "https://images.unsplash.com/photo-1639322537133-5fcead339c3a?w=800&q=80",
  },
];

const NewsPage = () => {
  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search news..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ecosystem" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter((item) => item.category === "Ecosystem")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="technology" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter((item) => item.category === "Technology")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter((item) => item.category === "Partnerships")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter((item) => item.category === "Events")
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems
              .filter((item) => item.saved)
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

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

const NewsCard = ({ item }: { item: NewsItemProps }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {item.category}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
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
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{item.comments} comments</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-muted">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted">
            {item.saved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsPage;

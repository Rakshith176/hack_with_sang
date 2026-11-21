import React, { useEffect, useState } from 'react';
import { StoryGraph, GraphNode, GraphEdge } from './types';
import { fetchFlagshipStory, fetchStoriesCatalog, StoryCatalogItem, TrendingNewsItem, analyzeLiveHeadline } from './api/client';
import { Header } from './components/Header';
import { LineageSpine } from './components/LineageSpine';
import { DriftInspector } from './components/DriftInspector';
import { SystemicRipple } from './components/SystemicRipple';
import { InterrogateModal } from './components/InterrogateModal';
import { NewsDiscoveryModal } from './components/NewsDiscoveryModal';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [story, setStory] = useState<StoryGraph | null>(null);
  const [catalog, setCatalog] = useState<StoryCatalogItem[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState('flagship_crowdstrike_2024');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lineage' | 'drift' | 'ripple'>('lineage');
  const [selectedThread, setSelectedThread] = useState<string>('all');

  // Modals state
  const [interrogateModalOpen, setInterrogateModalOpen] = useState(false);
  const [targetClaimId, setTargetClaimId] = useState('c1');
  const [targetClaimText, setTargetClaimText] = useState('');
  
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const [analyzingLive, setAnalyzingLive] = useState(false);

  useEffect(() => {
    // Load catalog and initial story
    Promise.all([fetchStoriesCatalog(), fetchFlagshipStory(selectedStoryId)])
      .then(([catData, storyData]) => {
        setCatalog(catData);
        setStory(storyData);
        setTargetClaimText(storyData.focus_headline);
      })
      .catch((err) => console.error('Failed to load initial data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectStory = async (storyId: string) => {
    setSelectedStoryId(storyId);
    setLoading(true);
    try {
      const data = await fetchFlagshipStory(storyId);
      setStory(data);
      setTargetClaimText(data.focus_headline);
    } catch (err) {
      console.error('Error switching story', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLiveArticle = async (article: TrendingNewsItem) => {
    setAnalyzingLive(true);
    try {
      const analyzedGraph = await analyzeLiveHeadline({
        title: article.title,
        snippet: article.snippet,
        link: article.link,
        source: article.source_name,
      });
      setStory(analyzedGraph);
      setTargetClaimText(analyzedGraph.focus_headline);
      setSelectedStoryId(analyzedGraph.story_id);
      setDiscoveryModalOpen(false);
    } catch (err) {
      console.error('Failed to analyze live article', err);
    } finally {
      setAnalyzingLive(false);
    }
  };

  const handleOpenInterrogate = (claimId: string, claimText: string) => {
    setTargetClaimId(claimId);
    setTargetClaimText(claimText);
    setInterrogateModalOpen(true);
  };

  const handleAppendDiscoveredNode = (newNode: GraphNode, newEdge: GraphEdge) => {
    if (!story) return;
    setStory({
      ...story,
      nodes: [newNode, ...story.nodes],
      edges: [newEdge, ...story.edges],
    });
  };

  if (loading || !story) {
    return (
      <div className="h-screen w-screen bg-[#090D14] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs font-mono text-gray-400">Loading PlaceWire Connecting Lineage...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#090D14] flex flex-col overflow-hidden">
      {/* Top Header & Tab Controls */}
      <Header
        headline={story.focus_headline}
        epistemicScore={story.epistemic_score}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        catalog={catalog}
        selectedStoryId={selectedStoryId}
        onSelectStory={handleSelectStory}
        onOpenDiscovery={() => setDiscoveryModalOpen(true)}
        onChallengeFocus={() => handleOpenInterrogate('focus_event', story.focus_headline)}
      />

      {/* Main Forensic Canvas */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'lineage' && (
          <LineageSpine
            nodes={story.nodes}
            edges={story.edges}
            selectedThread={selectedThread}
            onInterrogateNode={(node) => handleOpenInterrogate(node.id, node.summary)}
            onNodesUpdated={handleAppendDiscoveredNode}
          />
        )}

        {activeTab === 'drift' && (
          <DriftInspector
            records={story.drift_records}
            onChallengeClaim={(claimText) => handleOpenInterrogate('drift_claim', claimText)}
          />
        )}

        {activeTab === 'ripple' && (
          <SystemicRipple
            nodes={story.nodes}
            edges={story.edges}
            onInterrogateNode={(node) => handleOpenInterrogate(node.id, node.summary)}
          />
        )}
      </main>

      {/* Live Interrogation Modal (You.com) */}
      <InterrogateModal
        isOpen={interrogateModalOpen}
        onClose={() => setInterrogateModalOpen(false)}
        claimId={targetClaimId}
        claimText={targetClaimText}
      />

      {/* Live News Discovery Modal (SerpApi Google News) */}
      <NewsDiscoveryModal
        isOpen={discoveryModalOpen}
        onClose={() => setDiscoveryModalOpen(false)}
        onSelectArticle={handleSelectLiveArticle}
        analyzing={analyzingLive}
      />
    </div>
  );
};

export default App;

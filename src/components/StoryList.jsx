import React, { useState, useEffect } from 'react';
import { Box, Text, Link, VStack, Input, useColorMode, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(data => {
        const top10Ids = data.slice(0, 10);
        return Promise.all(top10Ids.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())));
      })
      .then(stories => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch(error => console.error('Error fetching stories:', error));
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Box>
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
            <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
            <Text>Upvotes: {story.score}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StoryList;
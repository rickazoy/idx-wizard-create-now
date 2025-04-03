
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, compact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`flex w-full max-w-3xl mx-auto ${compact ? 'flex-row' : 'flex-col md:flex-row'} gap-2 ${className}`}
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="City, neighborhood, or ZIP"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 ${compact ? 'h-10' : 'h-12'}`}
        />
      </div>
      <Button 
        type="submit" 
        className={`btn-primary ${compact ? 'h-10' : 'h-12'} whitespace-nowrap min-w-[100px]`}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;

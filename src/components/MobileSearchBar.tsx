import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSearchBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchTerm = '',
  onSearchChange,
  placeholder = 'Search products...'
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-16 z-40 bg-background border-b px-4 py-3 shadow-sm">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 pr-4 h-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {searchTerm && (
          <button
            onClick={() => onSearchChange?.('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileSearchBar;
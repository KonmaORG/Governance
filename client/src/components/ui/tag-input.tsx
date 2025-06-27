"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={className}>
      {/* Display existing tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200 pr-1"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 ml-1 hover:bg-teal-300 rounded-full"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input field with plus button */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-teal-200 focus:border-teal-500"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="border-teal-200 text-teal-600 hover:bg-teal-50 disabled:opacity-50 bg-transparent"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

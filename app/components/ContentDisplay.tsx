'use client'
import React, { useState } from 'react';

interface ContentDisplayProps {
  content?: string;
  content1?: string;
content2?: string;
content3?: string;
content4?: string;
content5?: string;
content6?: string;
content7?: string;
content8?: string;
content9?: string;
content10?: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  content1,
  content2,
  content3,
  content4,
  content5,
  content6,
  content7,
  content8,
  content9,
  content10,
}) => {
  const [showAll, setShowAll] = useState(false);
  const numItemsToShow = 5;

  const toggleContent = () => {
    setShowAll(!showAll);
  };

  const renderContent = (contentProp?: string) => {
    if (!contentProp) return null;
    return (
      <li>
        {showAll ? (
          <p>{contentProp}</p>
        ) : (
          <p>{contentProp}</p>
        )}
      </li>
    );
  };

  return (
    <div>
      <ul>
        {renderContent(content)}
        {renderContent(content1)}
        {renderContent(content2)}
        {renderContent(content3)}
        {renderContent(content4)}
        {renderContent(content5)} 
           {renderContent(content6)}
            
        {showAll && (
          <>
        {renderContent(content7)}
            {renderContent(content8)}
            {renderContent(content9)}
            {renderContent(content10)}
          </>
        )}
      </ul>
      {(content || content1 || content2 || content3 || content4 || content5 || content6 || content7 || content8 || content9 || content10) && (
        <p style={{ color: 'blue', cursor: 'pointer' }} onClick={toggleContent}>
          {showAll ? 'Show Less' : 'Show More'}
        </p>
      )}
    </div>
  );
};

export default ContentDisplay;
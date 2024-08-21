'use client'
import React, { useState } from 'react';

const ContentDisplay = ({
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

  const toggleContent = () => {
    setShowAll(!showAll);
  };

  const renderContent = (contentProp) => {
    if (!contentProp) return null;
    return (
      <li>
        <p>{contentProp}</p>
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
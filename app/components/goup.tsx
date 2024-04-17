'use client'
import React from 'react';

export default function Goup() {
    const scrollToTop = () => {
        window.scroll({
            top: 0,
        });
    };

    return (
        <>
            <button
                onClick={scrollToTop}
                style={{
                    borderRadius: '50%',
                    border: 'none',
                    padding: '1rem 20px',
                    backgroundColor: '#2072ed',
                    color: '#fff',
                    cursor: 'pointer',
                }}
            >
                &#x2191;
            </button>
        </>
    );
}

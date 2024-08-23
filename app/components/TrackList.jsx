'use client'
import React from 'react';

const TrackList = ({ tracks }) => {
  // Check if tracks is undefined or null
  if (!tracks) {
    return <p>No tracks available</p>;
  }
  // Convert tracks object to an array and sort by track number
  const trackArray = Object.entries(tracks)
    .map(([key, value]) => value)
    .sort((a, b) => a.track_number - b.track_number);

  return (
    <div className="track-list-container">
    <h3 className="track-list-title">Track List:</h3>
    <div className="track-list-table-container">
      <table className="track-list-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {trackArray.map((track) => (
            <tr key={track.track_number}>
              <td>{track.track_number}</td>
              <td>{track.track_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <style jsx>{`
      .track-list-container {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
      }
      .track-list-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .track-list-table-container {
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
      }
      .track-list-table {
        width: 100%;
        border-collapse: collapse;
      }
      .track-list-table th,
      .track-list-table td {
        padding: 0.5rem 1rem;
        text-align: left;
      }
      .track-list-table th {
        background-color: #f3f4f6;
        font-weight: 600;
      }
      .track-list-table tr {
        border-bottom: 1px solid #ccc;
      }
      .track-list-table tr:last-child {
        border-bottom: none;
      }
    `}</style>
  </div>
  );
};

export default TrackList;
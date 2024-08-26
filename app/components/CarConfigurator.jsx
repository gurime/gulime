import React from 'react';
import { Wind, Zap, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  useCarDetails,
  getColorPrice,
  getColorButtonStyle,
  getColorUrl,
  getCurrentPrice,
  getRimButtonStyle,
  getRimUrl,
  getRimPrice,
  getCarImageUrl,
  getRimThumbnailUrl,
  getRimSize
} from '../utils/carconfig';

const CarConfigurator = ({
  selectedColor,
  setSelectedColor,
  selectedConfig,
  setSelectedConfig,
  selectedRim,
  setSelectedRim
}) => {
  const params = useParams();
  const id = params.id;

  const { carDetails, sortedColorKeys, sortedConfigKeys, sortedRimKeys } = useCarDetails(
    id,
    setSelectedColor,
    setSelectedConfig,
    setSelectedRim,
    selectedColor,
    selectedConfig,
    selectedRim
  );

  const currentPrice = getCurrentPrice(carDetails, selectedConfig, selectedColor, selectedRim);
  const carImageUrl = getCarImageUrl(carDetails, selectedRim, selectedColor);
  const rimSize = getRimSize(carDetails, selectedRim);  // Get the rim size
  const rimPrice = getRimPrice(carDetails, selectedRim);

  return (
    <div className="configurator-grid">
         <div className="car-image">
        {carImageUrl ? (
               <img
               src={carImageUrl}
               alt={`${carDetails?.cartitle || 'Car'} in ${selectedColor} with ${selectedRim}`}
               className="main-car-image"
             />
        ) : (
          <div className="image-placeholder">Image not available</div>
        )}
      </div>
      
      <div className="car-details">
        <div className="car-specs">
          {carDetails?.carrange && (
            <div className="spec-item">
              <Zap />
              <p className="spec-value">{carDetails.carrange} mi</p>
              <p className="spec-label">Range</p>
            </div>
          )}
          {carDetails?.topspeed && (
            <div className="spec-item">
              <Wind />
              <p className="spec-value">{carDetails.topspeed} mph</p>
              <p className="spec-label">Top Speed</p>
            </div>
          )}
          {carDetails?.carsecs && (
            <div className="spec-item">
              <ArrowRight />
              <p className="spec-value">{carDetails.carsecs}s</p>
              <p className="spec-label">0-60 mph</p>
            </div>
          )}
        </div>
        {sortedConfigKeys.map((key) => {
          const config = carDetails?.configurations?.[key];
          if (!config) return null;
          
          let formattedPrice = '';
          if (config.price !== undefined) {
            const numericPrice = typeof config.price === 'string' 
              ? parseFloat(config.price.replace(/,/g, ''))
              : config.price;
            
            if (!isNaN(numericPrice)) {
              formattedPrice = `$${numericPrice.toLocaleString()}`;
            }
          }

          return (
            <div key={key} className="configuration-item">
              <label>
                <input
                  type="radio"
                  name="configuration"
                  value={key}
                  checked={selectedConfig === key}
                  onChange={() => setSelectedConfig(key)}
                />
                <span>{config.name}</span>
                {formattedPrice && <span className="configuration-price">{formattedPrice}</span>}
              </label>
            </div>
          );
        })}

<div className="color-selector">
        {selectedColor && <h2 className="selected-color-name">{selectedColor}</h2>}
        {selectedColor && (
          <p className="color-inclusion">
            {(() => {
              const colorPrice = getColorPrice(carDetails, selectedColor);
              if (colorPrice === 'Included') return 'Included';
              return colorPrice !== null ? `$${colorPrice.toLocaleString()}` : '';
            })()}
          </p>
        )}
        <div className="color-options">
          {sortedColorKeys.map((color) => (
            <div key={color} className="color-option-container">
              <button
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={getColorButtonStyle(color)}
                onClick={() => setSelectedColor(color)}
              />
            </div>
          ))}
        </div>
      </div>

<div className="rim-selector">{rimPrice !== null && (
          <p className="rim-price">
            {rimPrice === 'Included' ? 'Included' : `$${rimPrice.toLocaleString()}`}
          </p>
        )}
{selectedRim && <h2 className="selected-rim-name">   
{rimSize && <h2 className="rim-size">{rimSize}" Wheels</h2>}  
{selectedRim}</h2>}

        <div className="rim-options">
          {sortedRimKeys.map((rim) => (
            <div key={rim} className="rim-option-container">
              <button
                className={`rim-option ${selectedRim === rim ? 'selected' : ''}`}
                onClick={() => setSelectedRim(rim)}
              >
               
                <img 
                  src={getRimThumbnailUrl(carDetails, rim)}
                  alt={rim} 
                  className="rim-thumbnail"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
        {currentPrice > 0 &&  (
          <div className="current-price">
            <p>${currentPrice.toLocaleString() || ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarConfigurator;
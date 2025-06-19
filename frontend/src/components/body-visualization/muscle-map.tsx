
import React from "react";

interface MuscleMapProps {
  gender: "male" | "female";
  highlightedMuscles: string[];
  className?: string;
}

export default function MuscleMap({ gender, highlightedMuscles, className = "" }: MuscleMapProps) {
  const isHighlighted = (muscle: string) => highlightedMuscles.includes(muscle);

  const getHighlightColor = (muscle: string) => {
    return isHighlighted(muscle) ? "#ef4444" : "#f8fafc";
  };

  const getStrokeColor = (muscle: string) => {
    return isHighlighted(muscle) ? "#dc2626" : "#e2e8f0";
  };

  return (
    <div className={`muscle-map ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        {/* Front View */}
        <div className="flex flex-col items-center">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Front View</h5>
          <svg viewBox="0 0 300 500" className="w-full h-full max-w-[200px]">
            {/* Head */}
            <ellipse cx="150" cy="40" rx="25" ry="35" fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Neck */}
            <rect x="140" y="70" width="20" height="25" fill="none" stroke="#94a3b8" strokeWidth="1"/>

            {/* Torso outline */}
            <path d="M120 95 L180 95 L185 120 L180 200 L175 280 L165 300 L135 300 L125 280 L120 200 L115 120 Z" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Arms outline */}
            <path d="M115 120 L95 130 L85 180 L90 220 L95 240 L100 250" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M185 120 L205 130 L215 180 L210 220 L205 240 L200 250" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Legs outline */}
            <path d="M135 300 L130 380 L125 450 L130 480" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M165 300 L170 380 L175 450 L170 480" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* FRONT MUSCLES */}

            {/* Traps - Trapezoid muscle shape */}
            <path d="M125 85 Q135 80 150 82 Q165 80 175 85 L170 110 Q150 105 130 110 Z" 
                  fill={getHighlightColor("traps")} stroke={getStrokeColor("traps")} strokeWidth="1"/>

            {/* Chest (Pectorals) - Fan-shaped pectoral muscles */}
            <path d="M125 110 Q140 105 150 115 Q148 125 145 135 Q138 145 130 140 Q122 130 120 120 Q122 115 125 110 Z" 
                  fill={getHighlightColor("chest")} stroke={getStrokeColor("chest")} strokeWidth="1"/>
            <path d="M175 110 Q160 105 150 115 Q152 125 155 135 Q162 145 170 140 Q178 130 180 120 Q178 115 175 110 Z" 
                  fill={getHighlightColor("chest")} stroke={getStrokeColor("chest")} strokeWidth="1"/>

            {/* Shoulders (Anterior Deltoids) - Shoulder cap shape */}
            <path d="M108 108 Q118 102 125 108 Q123 118 120 128 Q115 135 108 130 Q100 125 98 118 Q100 112 108 108 Z" 
                  fill={getHighlightColor("shoulders")} stroke={getStrokeColor("shoulders")} strokeWidth="1"/>
            <path d="M192 108 Q182 102 175 108 Q177 118 180 128 Q185 135 192 130 Q200 125 202 118 Q200 112 192 108 Z" 
                  fill={getHighlightColor("shoulders")} stroke={getStrokeColor("shoulders")} strokeWidth="1"/>

            {/* Biceps - Bicep brachii shape */}
            <path d="M102 140 Q110 135 115 142 Q114 155 112 170 Q108 180 102 175 Q96 170 94 158 Q96 148 102 140 Z" 
                  fill={getHighlightColor("biceps")} stroke={getStrokeColor("biceps")} strokeWidth="1"/>
            <path d="M198 140 Q190 135 185 142 Q186 155 188 170 Q192 180 198 175 Q204 170 206 158 Q204 148 198 140 Z" 
                  fill={getHighlightColor("biceps")} stroke={getStrokeColor("biceps")} strokeWidth="1"/>

            {/* Forearms - Tapered forearm shape */}
            <path d="M100 185 Q107 180 110 188 Q109 205 106 220 Q102 228 98 223 Q92 218 90 208 Q92 195 100 185 Z" 
                  fill={getHighlightColor("forearms")} stroke={getStrokeColor("forearms")} strokeWidth="1"/>
            <path d="M200 185 Q193 180 190 188 Q191 205 194 220 Q198 228 202 223 Q208 218 210 208 Q208 195 200 185 Z" 
                  fill={getHighlightColor("forearms")} stroke={getStrokeColor("forearms")} strokeWidth="1"/>

            {/* Abs (Rectus Abdominis) - Six-pack segmented shape */}
            <g fill={getHighlightColor("abs")} stroke={getStrokeColor("abs")} strokeWidth="1">
              {/* Upper abs */}
              <path d="M140 155 Q145 150 150 155 Q148 165 145 170 Q140 172 138 168 Q136 163 138 158 Q139 156 140 155 Z"/>
              <path d="M160 155 Q155 150 150 155 Q152 165 155 170 Q160 172 162 168 Q164 163 162 158 Q161 156 160 155 Z"/>
              {/* Middle abs */}
              <path d="M140 175 Q145 170 150 175 Q148 185 145 190 Q140 192 138 188 Q136 183 138 178 Q139 176 140 175 Z"/>
              <path d="M160 175 Q155 170 150 175 Q152 185 155 190 Q160 192 162 188 Q164 183 162 178 Q161 176 160 175 Z"/>
              {/* Lower abs */}
              <path d="M140 195 Q145 190 150 195 Q148 205 145 210 Q140 212 138 208 Q136 203 138 198 Q139 196 140 195 Z"/>
              <path d="M160 195 Q155 190 150 195 Q152 205 155 210 Q160 212 162 208 Q164 203 162 198 Q161 196 160 195 Z"/>
            </g>

            {/* Obliques - External oblique muscles */}
            <path d="M125 165 Q135 170 140 180 Q138 195 135 205 Q130 210 125 205 Q120 195 118 185 Q120 175 125 165 Z" 
                  fill={getHighlightColor("obliques")} stroke={getStrokeColor("obliques")} strokeWidth="1"/>
            <path d="M175 165 Q165 170 160 180 Q162 195 165 205 Q170 210 175 205 Q180 195 182 185 Q180 175 175 165 Z" 
                  fill={getHighlightColor("obliques")} stroke={getStrokeColor("obliques")} strokeWidth="1"/>

            {/* Quadriceps - Four distinct heads */}
            <g fill={getHighlightColor("quadriceps")} stroke={getStrokeColor("quadriceps")} strokeWidth="1">
              {/* Vastus lateralis */}
              <path d="M125 305 Q132 300 138 308 Q136 340 133 360 Q128 368 123 363 Q118 355 120 340 Q122 320 125 305 Z"/>
              {/* Vastus medialis */}
              <path d="M142 305 Q149 300 155 308 Q153 340 150 360 Q145 368 140 363 Q135 355 137 340 Q139 320 142 305 Z"/>
              {/* Rectus femoris */}
              <path d="M133 305 Q140 300 147 308 Q145 340 142 360 Q137 368 132 363 Q127 355 129 340 Q131 320 133 305 Z"/>
              {/* Vastus intermedius (deeper, partially visible) */}
              <path d="M138 310 Q145 305 152 313 Q150 345 147 365 Q142 373 137 368 Q132 360 134 345 Q136 325 138 310 Z"/>
            </g>

            {/* Right leg quadriceps */}
            <g fill={getHighlightColor("quadriceps")} stroke={getStrokeColor("quadriceps")} strokeWidth="1">
              <path d="M162 305 Q169 300 175 308 Q173 340 170 360 Q165 368 160 363 Q155 355 157 340 Q159 320 162 305 Z"/>
              <path d="M148 305 Q155 300 162 308 Q160 340 157 360 Q152 368 147 363 Q142 355 144 340 Q146 320 148 305 Z"/>
              <path d="M155 305 Q162 300 169 308 Q167 340 164 360 Q159 368 154 363 Q149 355 151 340 Q153 320 155 305 Z"/>
              <path d="M149 310 Q156 305 163 313 Q161 345 158 365 Q153 373 148 368 Q143 360 145 345 Q147 325 149 310 Z"/>
            </g>

            {/* Adductors - Inner thigh muscles */}
            <path d="M145 310 Q155 308 158 318 Q155 335 150 340 Q145 342 140 340 Q135 335 138 325 Q142 315 145 310 Z" 
                  fill={getHighlightColor("adductors")} stroke={getStrokeColor("adductors")} strokeWidth="1"/>

            {/* Shins - Tibialis anterior */}
            <path d="M128 385 Q135 380 138 390 Q136 420 133 440 Q128 448 123 443 Q118 435 120 420 Q122 400 128 385 Z" 
                  fill={getHighlightColor("shins")} stroke={getStrokeColor("shins")} strokeWidth="1"/>
            <path d="M172 385 Q165 380 162 390 Q164 420 167 440 Q172 448 177 443 Q182 435 180 420 Q178 400 172 385 Z" 
                  fill={getHighlightColor("shins")} stroke={getStrokeColor("shins")} strokeWidth="1"/>

            {/* Calves (front) - Gastrocnemius */}
            <path d="M123 385 Q130 380 133 390 Q131 415 128 430 Q123 438 118 433 Q113 425 115 415 Q117 395 123 385 Z" 
                  fill={getHighlightColor("calves")} stroke={getStrokeColor("calves")} strokeWidth="1"/>
            <path d="M177 385 Q170 380 167 390 Q169 415 172 430 Q177 438 182 433 Q187 425 185 415 Q183 395 177 385 Z" 
                  fill={getHighlightColor("calves")} stroke={getStrokeColor("calves")} strokeWidth="1"/>
          </svg>
        </div>

        {/* Back View */}
        <div className="flex flex-col items-center">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Back View</h5>
          <svg viewBox="0 0 300 500" className="w-full h-full max-w-[200px]">
            {/* Head */}
            <ellipse cx="150" cy="40" rx="25" ry="35" fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Neck */}
            <rect x="140" y="70" width="20" height="25" fill="none" stroke="#94a3b8" strokeWidth="1"/>

            {/* Torso outline */}
            <path d="M120 95 L180 95 L185 120 L180 200 L175 280 L165 300 L135 300 L125 280 L120 200 L115 120 Z" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Arms outline */}
            <path d="M115 120 L95 130 L85 180 L90 220 L95 240 L100 250" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M185 120 L205 130 L215 180 L210 220 L205 240 L200 250" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* Legs outline */}
            <path d="M135 300 L130 380 L125 450 L130 480" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M165 300 L170 380 L175 450 L170 480" 
                  fill="none" stroke="#94a3b8" strokeWidth="2"/>

            {/* BACK MUSCLES */}

            {/* Upper Traps - Trapezius diamond shape */}
            <path d="M125 85 Q135 80 150 82 Q165 80 175 85 L170 115 Q150 110 130 115 Z" 
                  fill={getHighlightColor("traps")} stroke={getStrokeColor("traps")} strokeWidth="1"/>

            {/* Middle and Lower Traps */}
            <path d="M130 115 L170 115 Q168 130 165 140 Q150 135 135 140 Q132 130 130 115 Z" 
                  fill={getHighlightColor("traps")} stroke={getStrokeColor("traps")} strokeWidth="1"/>

            {/* Rhomboids - Diamond-shaped between shoulder blades */}
            <path d="M138 120 Q150 115 162 120 Q160 135 150 140 Q140 135 138 120 Z" 
                  fill={getHighlightColor("rhomboids")} stroke={getStrokeColor("rhomboids")} strokeWidth="1"/>

            {/* Posterior Deltoids - Rounded shoulder shape */}
            <path d="M108 108 Q118 102 125 108 Q123 118 120 128 Q115 135 108 130 Q100 125 98 118 Q100 112 108 108 Z" 
                  fill={getHighlightColor("shoulders")} stroke={getStrokeColor("shoulders")} strokeWidth="1"/>
            <path d="M192 108 Q182 102 175 108 Q177 118 180 128 Q185 135 192 130 Q200 125 202 118 Q200 112 192 108 Z" 
                  fill={getHighlightColor("shoulders")} stroke={getStrokeColor("shoulders")} strokeWidth="1"/>

            {/* Lats - Latissimus dorsi wing-like shape */}
            <path d="M125 140 Q115 155 118 190 Q122 200 135 185 Q140 170 138 155 Q135 148 130 145 Q127 142 125 140 Z" 
                  fill={getHighlightColor("lats")} stroke={getStrokeColor("lats")} strokeWidth="1"/>
            <path d="M175 140 Q185 155 182 190 Q178 200 165 185 Q160 170 162 155 Q165 148 170 145 Q173 142 175 140 Z" 
                  fill={getHighlightColor("lats")} stroke={getStrokeColor("lats")} strokeWidth="1"/>

            {/* Triceps - Horseshoe-shaped three heads */}
            <path d="M102 140 Q110 135 115 142 Q114 155 112 170 Q108 180 102 175 Q96 170 94 158 Q96 148 102 140 Z" 
                  fill={getHighlightColor("triceps")} stroke={getStrokeColor("triceps")} strokeWidth="1"/>
            <path d="M198 140 Q190 135 185 142 Q186 155 188 170 Q192 180 198 175 Q204 170 206 158 Q204 148 198 140 Z" 
                  fill={getHighlightColor("triceps")} stroke={getStrokeColor("triceps")} strokeWidth="1"/>

            {/* Forearms (back) - Extensor muscles */}
            <path d="M100 185 Q107 180 110 188 Q109 205 106 220 Q102 228 98 223 Q92 218 90 208 Q92 195 100 185 Z" 
                  fill={getHighlightColor("forearms")} stroke={getStrokeColor("forearms")} strokeWidth="1"/>
            <path d="M200 185 Q193 180 190 188 Q191 205 194 220 Q198 228 202 223 Q208 218 210 208 Q208 195 200 185 Z" 
                  fill={getHighlightColor("forearms")} stroke={getStrokeColor("forearms")} strokeWidth="1"/>

            {/* Erector Spinae - Spinal column muscles */}
            <g fill={getHighlightColor("erector_spinae")} stroke={getStrokeColor("erector_spinae")} strokeWidth="1">
              <path d="M142 155 Q147 150 152 155 Q150 185 148 215 Q145 240 142 238 Q139 235 141 215 Q143 185 142 155 Z"/>
              <path d="M158 155 Q153 150 148 155 Q150 185 152 215 Q155 240 158 238 Q161 235 159 215 Q157 185 158 155 Z"/>
            </g>

            {/* Lower Back - Lumbar region */}
            <path d="M130 215 Q150 210 170 215 Q168 240 165 250 Q150 255 135 250 Q132 240 130 215 Z" 
                  fill={getHighlightColor("lower_back")} stroke={getStrokeColor("lower_back")} strokeWidth="1"/>

            {/* Glutes - Gluteus maximus rounded shape */}
            <path d="M128 260 Q142 255 150 265 Q148 285 145 295 Q140 300 135 295 Q125 285 125 275 Q125 265 128 260 Z" 
                  fill={getHighlightColor("glutes")} stroke={getStrokeColor("glutes")} strokeWidth="1"/>
            <path d="M172 260 Q158 255 150 265 Q152 285 155 295 Q160 300 165 295 Q175 285 175 275 Q175 265 172 260 Z" 
                  fill={getHighlightColor("glutes")} stroke={getStrokeColor("glutes")} strokeWidth="1"/>

            {/* Hamstrings - Three distinct muscles */}
            <g fill={getHighlightColor("hamstrings")} stroke={getStrokeColor("hamstrings")} strokeWidth="1">
              {/* Biceps femoris */}
              <path d="M128 305 Q135 300 140 308 Q138 340 135 360 Q130 368 125 363 Q120 355 122 340 Q124 320 128 305 Z"/>
              {/* Semitendinosus */}
              <path d="M142 305 Q149 300 154 308 Q152 340 149 360 Q144 368 139 363 Q134 355 136 340 Q138 320 142 305 Z"/>
              {/* Semimembranosus */}
              <path d="M156 305 Q163 300 168 308 Q166 340 163 360 Q158 368 153 363 Q148 355 150 340 Q152 320 156 305 Z"/>
            </g>

            {/* Right leg hamstrings */}
            <g fill={getHighlightColor("hamstrings")} stroke={getStrokeColor("hamstrings")} strokeWidth="1">
              <path d="M165 305 Q172 300 177 308 Q175 340 172 360 Q167 368 162 363 Q157 355 159 340 Q161 320 165 305 Z"/>
              <path d="M148 305 Q155 300 160 308 Q158 340 155 360 Q150 368 145 363 Q140 355 142 340 Q144 320 148 305 Z"/>
              <path d="M132 305 Q139 300 144 308 Q142 340 139 360 Q134 368 129 363 Q124 355 126 340 Q128 320 132 305 Z"/>
            </g>

            {/* Calves (back) - Gastrocnemius bulge shape */}
            <path d="M128 375 Q138 370 142 380 Q140 405 137 425 Q132 435 127 430 Q122 425 120 410 Q122 390 128 375 Z" 
                  fill={getHighlightColor("calves")} stroke={getStrokeColor("calves")} strokeWidth="1"/>
            <path d="M172 375 Q162 370 158 380 Q160 405 163 425 Q168 435 173 430 Q178 425 180 410 Q178 390 172 375 Z" 
                  fill={getHighlightColor("calves")} stroke={getStrokeColor("calves")} strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Activated</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-1"></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

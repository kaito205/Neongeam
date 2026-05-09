import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 crt-scanlines z-50 pointer-events-none opacity-40" />
      <div className="fixed inset-0 flicker z-50 pointer-events-none bg-[rgba(18,16,16,0.02)]" />
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
    </>
  );
};

export const VaporwaveSkyline: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-vapor-dark">
      {/* Sun */}
      <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-1/4 w-[500px] h-[500px]">
        <div className="w-full h-full rounded-full bg-gradient-to-t from-neon-pink via-orange-500 to-transparent opacity-80 blur-sm" />
        {/* Sun scanlines (gaps) */}
        <div className="absolute inset-0 flex flex-col justify-end space-y-4 pb-4">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-vapor-dark" style={{ height: `${(i + 1) * 2}px` }} />
             ))}
        </div>
      </div>
      
      {/* Grid Floor */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 perspective-[400px]">
        <div className="w-full h-full bg-grid origin-top transform rotateX-[60deg] animate-grid-flow" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grid-flow {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        .animate-grid-flow {
          animation: grid-flow 2s linear infinite;
        }
      `}} />
    </div>
  );
};

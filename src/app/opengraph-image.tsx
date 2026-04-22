import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'MongoDBMigrate - MongoDB Migration Tool'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #00ED64 0%, #00684A 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: '#0d1117',
                fontSize: '40px',
                fontWeight: 'bold',
              }}
            >
              M
            </div>
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '60px',
              fontWeight: 'bold',
            }}
          >
            MongoDBMigrate
          </div>
        </div>
        <div
          style={{
            color: '#8a9bb0',
            fontSize: '32px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Migrate MongoDB data between clusters without terminal commands
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              background: '#00ED64',
              color: '#0d1117',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            No mongodump
          </div>
          <div
            style={{
              background: '#00ED64',
              color: '#0d1117',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            No mongorestore
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
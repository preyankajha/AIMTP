const jwt = require('jsonwebtoken');

async function verifyRememberMe() {
  try {
    const timestamp = Date.now();
    const email = `rememberme_${timestamp}@example.com`;
    const password = 'password123';
    
    console.log('1. Registering user...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Remember User',
        mobile: '9876543210',
        email,
        password
      })
    });
    const regData = await regRes.json();
    
    console.log('\n2. Testing Login WITH Remember Me...');
    const loginLongRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe: true })
    });
    const { refreshToken: longToken } = await loginLongRes.json();
    const decodedLong = jwt.decode(longToken);
    const durationLongDays = (decodedLong.exp - decodedLong.iat) / (60 * 60 * 24);
    console.log(`✅ Long token duration: ${durationLongDays.toFixed(0)} days`);
    
    console.log('\n3. Testing Login WITHOUT Remember Me...');
    const loginShortRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe: false })
    });
    const { refreshToken: shortToken } = await loginShortRes.json();
    const decodedShort = jwt.decode(shortToken);
    const durationShortDays = (decodedShort.exp - decodedShort.iat) / (60 * 60 * 24);
    console.log(`✅ Short token duration: ${durationShortDays.toFixed(0)} days`);

    if (Math.round(durationLongDays) === 30 && Math.round(durationShortDays) === 7) {
        console.log('\n🎉 Verification Successful: Correct token durations issued!');
    } else {
        throw new Error(`Duration mismatch: Long=${durationLongDays}, Short=${durationShortDays}`);
    }
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  }
}

verifyRememberMe();

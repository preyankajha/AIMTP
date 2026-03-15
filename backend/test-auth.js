async function testAuth() {
  try {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'password123';
    
    console.log('1. Testing Registration...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        mobile: '9876543210',
        email,
        password
      })
    });
    
    if (!regRes.ok) {
        throw new Error(`Reg failed: ${await regRes.text()}`);
    }
    const regData = await regRes.json();
    
    const { accessToken, refreshToken } = regData;
    if (!accessToken || !refreshToken) {
      throw new Error('Registration did not return both tokens');
    }
    console.log('✅ Registration successful. Both tokens received.');
    
    console.log('\n2. Testing Refresh Token endpoint...');
    const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!refreshRes.ok) {
        throw new Error(`Refresh failed: ${await refreshRes.text()}`);
    }
    const refreshData = await refreshRes.json();
    
    const newAccessToken = refreshData.accessToken;
    if (!newAccessToken) {
      throw new Error('Refresh endpoint did not return a new access token');
    }
    console.log('✅ Refresh successful. New access token received.');
    
    console.log('\n3. Testing API with new access token...');
    const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    
    if (!profileRes.ok) {
        throw new Error(`Profile fetch failed: ${await profileRes.text()}`);
    }
    const profileData = await profileRes.json();
    
    if (profileData.user.email !== email) {
      throw new Error('Profile endpoint returned incorrect user data');
    }
    console.log('✅ Profile fetch successful with new access token.');
    
    console.log('\nAll tests passed successfully! 🎉');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAuth();

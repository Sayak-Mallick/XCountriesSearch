import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countries-search-data-prod-812920491762.asia-south1.run.app/countries')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setCountries(data)
        setFilteredCountries(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching countries:', error)
        setError('Failed to fetch countries data. Please try again later.')
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries)
    } else {
      const filtered = countries.filter(country =>
        country.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCountries(filtered)
    }
  }, [searchTerm, countries])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="container">
      <h1>Country Search App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="countries-container">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div key={country.common} className="countryCard">
              <img src={country.png} alt={`${country.common} flag`} />
              <div className="country-name">{country.common}</div>
            </div>
          ))
        ) : (
          <div className="no-results">No countries found matching your search.</div>
        )}
      </div>
    </div>
  )
}

export default App

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, Coins, DollarSign } from 'lucide-react'

type AssetType = 'gold' | 'silver' | 'btc'

interface CalculationResult {
  gold: number
  silver: number
  btc: number
}

export default function Home() {
  const [inputAsset, setInputAsset] = useState<AssetType>('btc')
  const [inputValue, setInputValue] = useState<string>('')
  const [results, setResults] = useState<CalculationResult | null>(null)

  const calculatePrices = (asset: AssetType, value: number): CalculationResult => {
    let goldPrice: number
    let silverPrice: number
    let btcPrice: number

    switch (asset) {
      case 'btc':
        btcPrice = value
        goldPrice = -0.000007 * btcPrice + 1784.21
        silverPrice = -0.000015 * btcPrice + 23.14
        break
      
      case 'gold':
        goldPrice = value
        btcPrice = (1784.21 - goldPrice) / 0.000007
        silverPrice = 0.0135 * goldPrice - 0.51
        break
      
      case 'silver':
        silverPrice = value
        goldPrice = (silverPrice + 0.51) / 0.0135
        btcPrice = (1784.21 - goldPrice) / 0.000007
        break
      
      default:
        return { gold: 0, silver: 0, btc: 0 }
    }

    return {
      gold: Math.max(0, goldPrice),
      silver: Math.max(0, silverPrice),
      btc: Math.max(0, btcPrice)
    }
  }

  const handleCalculate = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value < 0) return

    const result = calculatePrices(inputAsset, value)
    setResults(result)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value && !isNaN(parseFloat(value))) {
      const result = calculatePrices(inputAsset, parseFloat(value))
      setResults(result)
    } else {
      setResults(null)
    }
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const getAssetIcon = (asset: AssetType) => {
    switch (asset) {
      case 'gold': return <Coins className="h-5 w-5 text-yellow-500" />
      case 'silver': return <Coins className="h-5 w-5 text-gray-400" />
      case 'btc': return <TrendingUp className="h-5 w-5 text-orange-500" />
    }
  }

  const getAssetName = (asset: AssetType) => {
    switch (asset) {
      case 'gold': return 'Gold'
      case 'silver': return 'Silver'
      case 'btc': return 'Bitcoin'
    }
  }

  const getUnit = (asset: AssetType) => {
    switch (asset) {
      case 'gold': return 'USD/oz'
      case 'silver': return 'USD/oz'
      case 'btc': return 'USD'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Gold2BTC Predictor
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            คำนวณราคา Gold, Silver และ Bitcoin 
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>ป้อนข้อมูลราคา</span>
            </CardTitle>
            <CardDescription>
              เลือกสินทรัพย์และใส่ราคาที่ต้องการคำนวณ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asset-select">เลือกสินทรัพย์</Label>
                <Select value={inputAsset} onValueChange={(value: AssetType) => setInputAsset(value)}>
                  <SelectTrigger id="asset-select" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span>Bitcoin (BTC)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gold">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span>Gold</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="silver">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-gray-400" />
                        <span>Silver</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-input">ราคา ({getUnit(inputAsset)})</Label>
                <Input
                  id="price-input"
                  type="number"
                  placeholder="ใส่ราคา..."
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bitcoin Card */}
            <Card className={`shadow-lg border-2 transition-all duration-300 ${
              inputAsset === 'btc' 
                ? 'border-orange-200 bg-orange-50/80' 
                : 'border-slate-200 bg-white/80 hover:border-orange-200'
            } backdrop-blur`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <span>Bitcoin</span>
                  </div>
                  {inputAsset === 'btc' && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      INPUT
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ${formatNumber(results.btc)}
                </div>
                <p className="text-sm text-slate-600">USD per BTC</p>
              </CardContent>
            </Card>

            {/* Gold Card */}
            <Card className={`shadow-lg border-2 transition-all duration-300 ${
              inputAsset === 'gold' 
                ? 'border-yellow-200 bg-yellow-50/80' 
                : 'border-slate-200 bg-white/80 hover:border-yellow-200'
            } backdrop-blur`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span>Gold</span>
                  </div>
                  {inputAsset === 'gold' && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      INPUT
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  ${formatNumber(results.gold)}
                </div>
                <p className="text-sm text-slate-600">USD per oz</p>
              </CardContent>
            </Card>

            {/* Silver Card */}
            <Card className={`shadow-lg border-2 transition-all duration-300 ${
              inputAsset === 'silver' 
                ? 'border-gray-300 bg-gray-50/80' 
                : 'border-slate-200 bg-white/80 hover:border-gray-300'
            } backdrop-blur`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-gray-400" />
                    <span>Silver</span>
                  </div>
                  {inputAsset === 'silver' && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      INPUT
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  ${formatNumber(results.silver)}
                </div>
                <p className="text-sm text-slate-600">USD per oz</p>
              </CardContent>
            </Card>
          </div>
        )}


      </div>
    </div>
  )
}

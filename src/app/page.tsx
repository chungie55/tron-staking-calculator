"use client";

import { useState } from "react";

export default function Home() {
  const [dailyVolume, setDailyVolume] = useState<string>("100");
  const [trxPrice, setTrxPrice] = useState<string>("0.36");
  const [trxToStake, setTrxToStake] = useState<string>("");
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Configurable TRON network constants
  const [energyPerTrc20Transfer, setEnergyPerTrc20Transfer] = useState<string>("130000");
  const [bandwidthPerTransfer, setBandwidthPerTransfer] = useState<string>("345");
  const [energyPricePerUnit, setEnergyPricePerUnit] = useState<string>("100");
  const [bandwidthPricePerUnit, setBandwidthPricePerUnit] = useState<string>("1000");
  const [energyPerTrxStaked, setEnergyPerTrxStaked] = useState<string>("10");
  const [professionalFee, setProfessionalFee] = useState<string>("15000");

  // Utility function to format numbers with 2 decimals and comma separators
  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Utility function to format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const calculateCosts = () => {
    const volume = parseFloat(dailyVolume) || 0;
    const price = parseFloat(trxPrice) || 0;
    const userTrxToStake = parseFloat(trxToStake) || 0;

    // Parse configurable constants
    const ENERGY_PER_TRC20_TRANSFER = parseInt(energyPerTrc20Transfer) || 130000;
    const BANDWIDTH_PER_TRANSFER = parseInt(bandwidthPerTransfer) || 345;
    const ENERGY_PRICE_PER_UNIT = parseInt(energyPricePerUnit) || 100;
    const BANDWIDTH_PRICE_PER_UNIT = parseInt(bandwidthPricePerUnit) || 1000;
    const ENERGY_PER_TRX_STAKED = parseInt(energyPerTrxStaked) || 10;
    const PROFESSIONAL_FEE = parseInt(professionalFee) || 15000;

    if (volume <= 0 || price <= 0) {
      return null;
    }

    const totalEnergyRequired = volume * ENERGY_PER_TRC20_TRANSFER;
    const totalBandwidthRequired = volume * BANDWIDTH_PER_TRANSFER;
    
    // Cost in TRX if burning energy/bandwidth
    const energyCostTRX = (totalEnergyRequired * ENERGY_PRICE_PER_UNIT) / 1000000; // Convert sun to TRX
    const bandwidthCostTRX = (totalBandwidthRequired * BANDWIDTH_PRICE_PER_UNIT) / 1000000; // Convert sun to TRX
    const totalBurnCostTRX = energyCostTRX + bandwidthCostTRX;
    
    // TRX required to stake for energy generation (maximum required)
    const maxTrxToStakeForEnergy = totalEnergyRequired / ENERGY_PER_TRX_STAKED;
    
    // Use user input or default to maximum required
    const actualTrxToStake = userTrxToStake > 0 ? userTrxToStake : maxTrxToStakeForEnergy;
    
    // Energy generated from staking
    const energyGeneratedFromStaking = actualTrxToStake * ENERGY_PER_TRX_STAKED;
    
    // Remaining energy that needs to be burned
    const remainingEnergyToBurn = Math.max(0, totalEnergyRequired - energyGeneratedFromStaking);
    const remainingEnergyCostTRX = (remainingEnergyToBurn * ENERGY_PRICE_PER_UNIT) / 1000000;
    
    // Cost breakdown in USD
    const energyCostUSD = energyCostTRX * price;
    const bandwidthCostUSD = bandwidthCostTRX * price;
    const totalBurnCostUSD = totalBurnCostTRX * price;
    const stakingCostUSD = actualTrxToStake * price;
    const remainingEnergyCostUSD = remainingEnergyCostTRX * price;
    const totalCostWithStakingUSD = remainingEnergyCostUSD + bandwidthCostUSD;

    // Monthly costs (assuming 30 days)
    const monthlyEnergyCostUSD = energyCostUSD * 30;
    const monthlyBandwidthCostUSD = bandwidthCostUSD * 30;
    const monthlyBurnCostUSD = totalBurnCostUSD * 30;
    const monthlyStakingCostUSD = stakingCostUSD; // Staking is one-time cost
    const monthlyRemainingEnergyCostUSD = remainingEnergyCostUSD * 30;
    const monthlyTotalCostWithStakingUSD =  monthlyRemainingEnergyCostUSD + monthlyBandwidthCostUSD;
    
    // Calculate months to break even
    const monthlySavings = monthlyBurnCostUSD - monthlyTotalCostWithStakingUSD;
    const monthsToBreakEven = monthlySavings > 0 ? PROFESSIONAL_FEE / monthlySavings : null;

    return {
      totalEnergyRequired,
      totalBandwidthRequired,
      energyCostTRX,
      bandwidthCostTRX,
      totalBurnCostTRX,
      maxTrxToStakeForEnergy,
      actualTrxToStake,
      energyGeneratedFromStaking,
      remainingEnergyToBurn,
      remainingEnergyCostTRX,
      energyCostUSD,
      bandwidthCostUSD,
      totalBurnCostUSD,
      stakingCostUSD,
      remainingEnergyCostUSD,
      totalCostWithStakingUSD,
      monthlyEnergyCostUSD,
      monthlyBandwidthCostUSD,
      monthlyBurnCostUSD,
      monthlyStakingCostUSD,
      monthlyRemainingEnergyCostUSD,
      monthlyTotalCostWithStakingUSD,
      monthlySavings,
      monthsToBreakEven,
    };
  };

  const results = calculateCosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TRON TRC20 Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Calculate energy, bandwidth, and TRX requirements for TRC20 transactions
          </p>
        </div>

        {/* Configuration Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Network Configuration
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Adjust TRON network parameters and costs
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showConfig ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showConfig && (
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="energyPerTrc20Transfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy per TRC20 Transfer
                  </label>
                  <input
                    id="energyPerTrc20Transfer"
                    type="number"
                    value={energyPerTrc20Transfer}
                    onChange={(e) => setEnergyPerTrc20Transfer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bandwidthPerTransfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bandwidth per Transfer
                  </label>
                  <input
                    id="bandwidthPerTransfer"
                    type="number"
                    value={bandwidthPerTransfer}
                    onChange={(e) => setBandwidthPerTransfer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="energyPricePerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy Price per Unit (Sun)
                  </label>
                  <input
                    id="energyPricePerUnit"
                    type="number"
                    value={energyPricePerUnit}
                    onChange={(e) => setEnergyPricePerUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="bandwidthPricePerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bandwidth Price per Unit (Sun)
                  </label>
                  <input
                    id="bandwidthPricePerUnit"
                    type="number"
                    value={bandwidthPricePerUnit}
                    onChange={(e) => setBandwidthPricePerUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="energyPerTrxStaked" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy per TRX Staked
                  </label>
                  <input
                    id="energyPerTrxStaked"
                    type="number"
                    value={energyPerTrxStaked}
                    onChange={(e) => setEnergyPerTrxStaked(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="professionalFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Service Fee (USD)
                  </label>
                  <input
                    id="professionalFee"
                    type="number"
                    value={professionalFee}
                    onChange={(e) => setProfessionalFee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Transaction Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="dailyVolume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Daily Transaction Volume
                </label>
                <input
                  id="dailyVolume"
                  type="number"
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(e.target.value)}
                  placeholder="Enter number of transactions per day"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="trxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current TRX Price
                </label>
                <input
                  id="trxPrice"
                  type="number"
                  step="0.01"
                  value={trxPrice}
                  onChange={(e) => setTrxPrice(e.target.value)}
                  placeholder="Enter TRX price"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="trxToStake" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TRX to Stake (Optional)
                </label>
                <input
                  id="trxToStake"
                  type="number"
                  step="1000"
                  value={trxToStake}
                  onChange={(e) => setTrxToStake(e.target.value)}
                  placeholder={results ? `Default: ${results.maxTrxToStakeForEnergy.toFixed(2)} TRX` : "Enter TRX amount to stake"}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use maximum required TRX for full energy coverage
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Cost Breakdown
            </h2>

            {results ? (
              <div className="space-y-6">
                {/* Resource Requirements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Resource Requirements
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Energy</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Total Energy Required:</span>
                          <span className="font-mono font-semibold">{results.totalEnergyRequired.toLocaleString()} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Energy from Staking:</span>
                          <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                            {results.energyGeneratedFromStaking.toLocaleString()} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Remaining Energy to Burn:</span>
                          <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                            {results.remainingEnergyToBurn.toLocaleString()} units
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bandwidth</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Bandwidth Required:</span>
                          <span className="font-mono font-semibold">{results.totalBandwidthRequired.toLocaleString()} units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRX Burn Costs */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                    TRX Burn Costs
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Remaining Energy Cost:</span>
                      <span className="font-mono font-semibold">{results.remainingEnergyCostTRX.toLocaleString()} TRX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Bandwidth Cost:</span>
                      <span className="font-mono font-semibold">{results.bandwidthCostTRX.toLocaleString()} TRX</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">Daily Burn Cost:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">
                        ${formatCurrency(results.remainingEnergyCostUSD + results.bandwidthCostUSD)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">Monthly Burn Cost:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">
                        ${formatCurrency(results.monthlyRemainingEnergyCostUSD + results.monthlyBandwidthCostUSD)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staking Requirements */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                    TRX Staking Strategy
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">TRX to Stake:</span>
                      <span className="font-mono font-semibold">{results.actualTrxToStake.toLocaleString()} TRX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Max Required TRX:</span>
                      <span className="font-mono font-semibold">{results.maxTrxToStakeForEnergy.toLocaleString()} TRX</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">One-time Staking Cost:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">
                        ${formatCurrency(results.stakingCostUSD)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Cost Comparison Summary
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Daily Costs</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Pure Burn Strategy:</span>
                          <span className="font-mono font-bold">${formatCurrency(results.totalBurnCostUSD)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">With Staking Strategy:</span>
                          <span className="font-mono font-bold">${formatCurrency(results.totalCostWithStakingUSD)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Costs</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Pure Burn Strategy:</span>
                          <span className="font-mono font-bold">${formatCurrency(results.monthlyBurnCostUSD)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">With Staking Strategy:</span>
                          <span className="font-mono font-bold">${formatCurrency(results.monthlyTotalCostWithStakingUSD)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300 font-semibold">Monthly Savings:</span>
                        <span className="font-mono font-bold text-green-600 dark:text-green-400">
                          ${formatCurrency(results.monthlySavings)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600 dark:text-gray-300 font-semibold">Yearly Savings:</span>
                        <span className="font-mono font-bold text-green-600 dark:text-green-400">
                          ${formatCurrency(results.monthlySavings * 12)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Break-even Analysis */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                    Break-even Analysis
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Professional Service Fee:</span>
                      <span className="font-mono font-semibold">${formatCurrency(parseInt(professionalFee) || 10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Monthly Savings:</span>
                      <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                        ${formatCurrency(results.monthlySavings)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">Months to Break Even:</span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {results.monthsToBreakEven ? `${results.monthsToBreakEven.toFixed(1)} months` : 'N/A'}
                      </span>
                    </div>
                    {results.monthsToBreakEven && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        * After {results.monthsToBreakEven.toFixed(1)} months, you&apos;ll have saved more than your professional service fee!
                      </div>
                    )}
                    {!results.monthsToBreakEven && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-2">
                        * Staking strategy doesn&apos;t provide monthly savings - consider pure burn strategy
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter transaction volume and TRX price to see cost breakdown
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About TRON Resource Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Energy</h3>
              <p>Energy is consumed when executing smart contracts and TRC20 transfers. You can either burn TRX or stake TRX to generate energy.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bandwidth</h3>
              <p>Bandwidth is consumed for all transactions. You can either burn TRX or stake TRX to generate bandwidth.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Staking vs Burning</h3>
              <p>Staking TRX generates resources daily and is more cost-effective for high-volume operations. Burning TRX is immediate but more expensive.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">TRC20 Transfer Cost</h3>
              <p>Each TRC20 transfer consumes {energyPerTrc20Transfer} energy units and {bandwidthPerTransfer} bandwidth units on the TRON network.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

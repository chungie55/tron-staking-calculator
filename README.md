# TRON TRC20 Calculator

A comprehensive web application for calculating energy, bandwidth, and TRX requirements for TRC20 transactions on the TRON blockchain. This tool helps users optimize their transaction costs by comparing different resource management strategies.

## Features

- **Resource Calculation**: Calculate energy and bandwidth requirements for TRC20 transactions
- **Cost Analysis**: Compare pure burn strategy vs. staking strategy costs
- **Break-even Analysis**: Determine when staking becomes profitable vs. professional services
- **Real-time Updates**: Dynamic calculations as you input parameters


## How It Works

The calculator analyzes two main strategies for handling TRON network resources:

### 1. Pure Burn Strategy
- Burn TRX directly for energy and bandwidth
- Immediate resource availability
- Higher cost per transaction

### 2. Staking Strategy
- Stake TRX to generate energy daily
- Lower ongoing costs
- Requires upfront TRX investment

## Usage

### Input Parameters

1. **Average Daily Transaction Volume**: Number of TRC20 transactions you expect to process daily
2. **Current TRX Price**: Current USD price of TRX token
3. **TRX to Stake** (Optional): Amount of TRX you want to stake for energy generation

### Understanding the Results

The calculator provides detailed breakdowns including:

- **Resource Requirements**: Total energy and bandwidth needed
- **TRX Burn Costs**: Daily and monthly costs for burning TRX
- **TRX Staking Strategy**: Required staking amounts and one-time costs
- **Cost Comparison**: Side-by-side comparison of both strategies
- **Break-even Analysis**: Time to recover professional service fees

### Key Metrics

- **Energy per TRC20 Transfer**: 130,000 units
- **Bandwidth per Transfer**: 345 units
- **Energy Generation**: 10 energy units per TRX staked per day
- **Professional Service Fee**: $10,000 USD

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tron-calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: Responsive design with dark mode support
- **Deployment**: Optimized for Vercel

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main calculator component
│   └── globals.css     # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

# Use Node.js LTS
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Copy source code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm run build

# Create automaton directory
RUN mkdir -p /root/.automaton

# Expose port (if needed for API)
EXPOSE 3000

# Start the automaton
CMD ["node", "dist/index.js", "--run"]

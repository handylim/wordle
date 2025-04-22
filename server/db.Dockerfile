FROM postgres:17

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    libpq-dev \
    postgresql-server-dev-17 \
    curl \
    pkg-config \
    cmake \
    libreadline6-dev \
    zlib1g-dev

# Set up environment for Rust
WORKDIR /home/postgres
ENV HOME=/home/postgres
ENV PATH=/home/postgres/.cargo/bin:$PATH
RUN chown postgres:postgres /home/postgres

# Switch to postgres user for Rust installation
USER postgres

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path --profile minimal --default-toolchain 1.81.0 && \
    . $HOME/.cargo/env && \
    rustup --version && \
    rustc --version && \
    cargo --version

# Install pgrx
RUN cargo install cargo-pgrx --version 0.12.7 --locked && \
    cargo pgrx init --pg17 $(which pg_config)

# Switch back to root for copying files
USER root

# Clone and build pgx_ulid
RUN git clone https://github.com/pksunkara/pgx_ulid.git && \
    cd pgx_ulid && \
    cargo pgrx install

# Set permissions
RUN chown -R postgres:postgres /home/postgres && \
    chown -R postgres:postgres /usr/share/postgresql/17/extension && \
    chown -R postgres:postgres /usr/lib/postgresql/17/lib

# Switch back to postgres for running the server
USER postgres

# Expose the PostgreSQL port
EXPOSE 5432

# Set the default command
CMD ["postgres"]
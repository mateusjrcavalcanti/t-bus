FROM ubuntu:20.04
# Instalação de dependências
RUN DEBIAN_FRONTEND=noninteractive apt-get update -qq \
    && DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    build-essential \
    git \
    gcc-multilib \
    g++-multilib \
    lib32z1 \
    python \
    unzip 

RUN git clone https://github.com/mateusjrcavalcanti/GPRS_CSDTK /opt/GPRS_CSDTK

# Criação de diretório para projetos
RUN mkdir /projects \
    && chown $USERNAME:$USERNAME /projects

RUN git clone https://github.com/mateusjrcavalcanti/GPRS_C_SDK.git /projects/GPRS_C_SDK --recursive
RUN chmod +x /projects/GPRS_C_SDK/build.sh 
RUN chmod +x /projects/GPRS_C_SDK/platform/compilation/elfCombine.pl

# Executa script de setup
RUN cd /opt/GPRS_CSDTK/CSDTK \
    && ./setup.sh ./ /projects \
    && echo "setup complete, now clean"

# Limpeza do sistema
RUN DEBIAN_FRONTEND=noninteractive apt-get autoremove -y --purge
RUN DEBIAN_FRONTEND=noninteractive apt-get clean -y
RUN rm -rf /var/lib/apt/lists/* 
RUN rm -rf /tmp 
RUN echo "build complete"

WORKDIR /projects/GPRS_C_SDK

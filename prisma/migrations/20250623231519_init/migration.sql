-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "quartos" INTEGER NOT NULL,
    "banheiros" INTEGER NOT NULL,
    "vagasGaragem" INTEGER NOT NULL DEFAULT 0,
    "areaTotal" DOUBLE PRECISION NOT NULL,
    "areaConstruida" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

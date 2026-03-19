"use client";

import Image from "next/image";
import { useState } from "react";

const accordionItems = [
  {
    title: "Política de privacidade da Haliotis",
    content:
      "A proteção dos seus dados pessoais é importante para nós, é por isso que a Haliotis adotou princípios sólidos sobre a proteção de dados pessoais. Como responsáveis pelo tratamento, recolhemos e processamos os seus dados pessoais em relação às nossas atividades. O objetivo deste Aviso de Proteção de Dados é informá-lo de quais as informações pessoais que recolhemos, por que as utilizamos e compartilhamos, por quanto tempo as mantemos, quais são seus direitos e como pode exercê-los. Em alguns casos, quando necessário, forneceremos informações adicionais sobre o processamento de seus dados pessoais, por exemplo, ao solicitar um produto ou serviço específico.",
  },
  {
    title: "QUE DADOS PESSOAIS TRATAMOS?",
    content:
      "Nós recolhemos e processamos os seus dados pessoais no âmbito das nossas actividades com o objectivo de alcançar um alto nível de personalização dos produtos e serviços que lhe prestamos.\n\nPodemos recolher vários tipos de informações pessoais sobre si, dependendo se você é: Utilizador que aceda às nossas páginas web\n\n• dados de identificação (por exemplo, nome, número de identificação e número do passaporte, nacionalidade, local e endereço IP);\n• informações de contacto (por exemplo, endereço para correspondência e endereço de e-mail, número de telefone)\n• dados relacionados aos seus hábitos e preferências;\n• dados sobre o uso dos nossos produtos;\n• dados das suas interações connosco: relatórios de contacto, as nossas redes sociais, e-mails, conversas de chat.\n\nNunca solicitamos dados pessoais relacionados a suas origens raciais ou étnicas, opiniões políticas, crenças religiosas ou filosóficas, afiliação sindical, dados genéticos, dados relacionados com a sua orientação sexual ou dados relacionados com condenações e infrações legais (dados de antecedentes criminais), a menos que isso seja devido a uma obrigação legal.",
  },
  {
    title:
      "CASOS ESPECÍFICOS DE TRATAMENTO DE DADOS PESSOAIS, INCLUINDO TRATAMENTOS DE FORMA INDIRETA",
    content:
      "Em determinadas circunstâncias, podemos coletar e processar os dados pessoais de pessoas com quem temos, poderíamos ter ou tivemos, um relacionamento direto, como:\n\n• utilizadores que acedam às nossas páginas web;\n• clientes potenciais ou existentes (grossista ou retalhista);\n• participantes nos nossos cursos ou eventos relacionados com a nossa actividade.",
  },
  {
    title: "TRANSFERÊNCIAS INTERNACIONAIS DE DADOS",
    content:
      "No caso de transferências internacionais fora do Espaço Económico Europeu (EEE), a Comissão Europeia reconheceu que certos países não pertencentes ao EEE fornecem um nível adequado de proteção de dados, pelo que os seus dados serão transferidos com as garantias adequadas oferecidas por esta legitimação de base para o tratamento de suas informações. No caso de transferências para países não pertencentes ao EEE, cujo nível de proteção não tenha sido reconhecido pela Comissão Europeia, recorreremos a outras bases de legitimação estabelecidas pelo Regulamento Geral de Proteção de Dados ou para aplicar as cláusulas contratuais aprovadas pela Comissão Europeia.",
  },
  {
    title: "QUANTO TEMPO MANTEMOS SEUS DADOS PESSOAIS?",
    content:
      "Manteremos seus dados pessoais durante: (i) o período estabelecido por lei; ou (ii) o período necessário para cumprirmos nossas obrigações. A maioria dos dados pessoais coletados em relação a um cliente específico é mantida durante o prazo da relação contratual com o referido cliente, o período fiscal estabelecido após o término da relação contratual ou conforme exigido pela lei aplicável.",
  },
  {
    title: "COMO PODE CONTATAR-NOS?",
    content: (
      <>
        Se tiver alguma dúvida sobre o processamento de seus dados pessoais,
        sobre este Aviso de Proteção de Dados, ou se você quiser uma cópia no
        seu idioma, por favor entre em contacto com:{" "}
        <a
          href="mailto:geral@haliotis.pt"
          className="underline"
          style={{
            textDecorationSkipInk: "none",
            color: "#e84814",
            opacity: 1,
          }}
        >
          geral@haliotis.pt
        </a>
      </>
    ),
  },
];

const ChevronDown = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
      fill="black"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.85369 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.85369 16.8534C9.78377 16.9234 9.69465 16.971 9.59761 16.9904C9.50058 17.0097 9.39999 16.9998 9.30858 16.9619C9.21718 16.924 9.13907 16.8599 9.08413 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08413 6.22239C9.13907 6.1401 9.21718 6.07595 9.30858 6.03808C9.39999 6.00021 9.50058 5.9903 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.85369 6.14663Z"
      fill="black"
    />
  </svg>
);

function AccordionItem({
  title,
  content,
  isDesktop,
}: {
  title: string;
  content: React.ReactNode;
  isDesktop: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <div>
        <h2
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "140%",
            color: "#111",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "160%",
            color: "#101010",
            opacity: 0.8,
            whiteSpace: "pre-line",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex w-full items-start justify-between py-4 text-left gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "140%",
            color: "#111",
          }}
        >
          {title}
        </span>
        <span className="flex-shrink-0 mt-[2px]">
          {open ? <ChevronDown /> : <ChevronRight />}
        </span>
      </button>
      {open && (
        <div
          className="pb-4"
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "140%",
            color: "#101010",
            whiteSpace: "pre-line",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicyContent() {
  return (
    <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px] xl:px-[188px] md:pb-[50px] md:pt-[46px]">
  <h1 className="font-semibold text-[32px] leading-[120%] xl:font-medium xl:text-[48px] xl:leading-[130%] text-[#111]"
  style={{ fontFamily: "var(--font-family)" }}
>
  Privacy Policy
</h1>

      {/* Gap */}
      <div className="h-[30px] xl:h-[50px]" />
      <div className="hidden xl:flex xl:gap-[30px]">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Subtitle */}
          <h2
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "140%",
              color: "#111",
              marginBottom: "10px",
            }}
          >
            Política de privacidade da Haliotis
          </h2>

          {/* Intro text */}
          <p
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 400,
              fontSize: "15px",
              lineHeight: "160%",
              
              color: "#101010",
              opacity: 0.8,
            }}
          >
            A proteção dos seus dados pessoais é importante para nós, é por isso
            que a Haliotis adotou princípios sólidos sobre a proteção de dados
            pessoais. Como responsáveis pelo tratamento, recolhemos e
            processamos os seus dados pessoais em relação às nossas atividades.
            O objetivo deste Aviso de Proteção de Dados é informá-lo de quais as
            informações pessoais que recolhemos, por que as utilizamos e
            compartilhamos, por quanto tempo as mantemos, quais são seus direitos
            e como pode exercê-los. Em alguns casos, quando necessário,
            forneceremos informações adicionais sobre o processamento de seus
            dados pessoais, por exemplo, ao solicitar um produto ou serviço
            específico.
          </p>

          {/* Accordion items (desktop = always open, skip first which is rendered above) */}
          <div className="mt-0">
            {accordionItems.slice(1).map((item, i) => (
              <AccordionItem
                key={i}
                title={item.title}
                content={item.content}
                isDesktop={true}
              />
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="flex-shrink-0">
          <Image
            src="/privacy-lock.png"
            alt="Privacy"
            width={600}
            height={400}
            style={{ width: "599px", height: "400px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="xl:hidden">
        {/* Accordion items (mobile = collapsible) */}
        <div>
          {accordionItems.map((item, i) => (
            <AccordionItem
              key={i}
              title={item.title}
              content={item.content}
              isDesktop={false}
            />
          ))}
        </div>

        {/* Image full width at bottom */}
        <Image
          src="/privacy-lock.png"
          alt="Privacy"
          width={600}
          height={400}
          className="w-full mt-6"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
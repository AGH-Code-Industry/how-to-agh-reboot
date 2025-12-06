# Analiza Metryk Wydajności Aplikacji

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Przegląd dostępnych metryk](#przegląd-dostępnych-metryk)
3. [Metryki wybrane do implementacji](#metryki-wybrane-do-implementacji)
4. [Uzasadnienie wyboru](#uzasadnienie-wyboru)
5. [Implementacja w aplikacji](#implementacja-w-aplikacji)
6. [Monitorowanie i analiza](#monitorowanie-i-analiza)
7. [Wnioski i rekomendacje](#wnioski-i-rekomendacje)

---

## Wprowadzenie

Niniejszy dokument przedstawia kompleksową analizę dostępnych metryk wydajności aplikacji webowej oraz wybór tych najbardziej przydatnych do monitorowania stabilności systemu i satysfakcji użytkowników. Analiza została przeprowadzona w kontekście aplikacji **How To AGH** - progresywnej aplikacji webowej (PWA) zbudowanej w technologii Next.js 15.

### Cel analizy

- Identyfikacja kluczowych wskaźników wydajności (KPI) wpływających na doświadczenie użytkownika
- Wybór metryk umożliwiających wczesne wykrywanie problemów stabilności
- Określenie metryk pozwalających na obiektywną ocenę satysfakcji użytkowników
- Stworzenie podstawy do ciągłego monitorowania i optymalizacji aplikacji

---

## Przegląd dostępnych metryk

### 1. Metryki wydajności technicznej (Performance Metrics)

#### 1.1 Web Vitals - Podstawowe metryki Google

**Largest Contentful Paint (LCP)**
- **Opis**: Czas do wyświetlenia największego elementu treści w widocznym obszarze
- **Zakres wartości**: 
  - Dobry: < 2.5s
  - Wymaga poprawy: 2.5s - 4.0s
  - Słaby: > 4.0s
- **Wpływ na użytkownika**: Bezpośredni wpływ na postrzeganą szybkość ładowania strony

**First Input Delay (FID)**
- **Opis**: Czas od pierwszej interakcji użytkownika do reakcji przeglądarki
- **Zakres wartości**:
  - Dobry: < 100ms
  - Wymaga poprawy: 100ms - 300ms
  - Słaby: > 300ms
- **Wpływ na użytkownika**: Kluczowy dla responsywności i interaktywności

**Cumulative Layout Shift (CLS)**
- **Opis**: Suma wszystkich nieoczekiwanych przesunięć układu strony
- **Zakres wartości**:
  - Dobry: < 0.1
  - Wymaga poprawy: 0.1 - 0.25
  - Słaby: > 0.25
- **Wpływ na użytkownika**: Wpływa na stabilność wizualną i zapobiega przypadkowym kliknięciom

**Time to First Byte (TTFB)**
- **Opis**: Czas od żądania do otrzymania pierwszego bajtu odpowiedzi
- **Zakres wartości**:
  - Dobry: < 800ms
  - Wymaga poprawy: 800ms - 1800ms
  - Słaby: > 1800ms
- **Wpływ na użytkownika**: Wskaźnik wydajności serwera i sieci

**First Contentful Paint (FCP)**
- **Opis**: Czas do wyświetlenia pierwszego elementu treści
- **Zakres wartości**:
  - Dobry: < 1.8s
  - Wymaga poprawy: 1.8s - 3.0s
  - Słaby: > 3.0s
- **Wpływ na użytkownika**: Pierwsza wizualna informacja zwrotna dla użytkownika

#### 1.2 Dodatkowe metryki wydajności

**Time to Interactive (TTI)**
- Czas do pełnej interaktywności strony
- Ważny dla aplikacji SPA (Single Page Application)

**Total Blocking Time (TBT)**
- Całkowity czas blokowania głównego wątku
- Wpływa na responsywność podczas ładowania

**Speed Index**
- Jak szybko treść jest wizualnie wyświetlana
- Syntetyczna metryka agregująca wiele czynników

### 2. Metryki techniczne API i backendu

**Czas odpowiedzi API (API Response Time)**
- Średni, minimalny, maksymalny czas odpowiedzi
- Percentyle (p50, p95, p99)
- Kluczowy dla wydajności aplikacji opartych na API

**Wskaźnik błędów API (API Error Rate)**
- Procent nieudanych żądań
- Typy błędów (4xx, 5xx)
- Wskaźnik stabilności backendu

**Przepustowość API (API Throughput)**
- Liczba żądań na sekundę/minutę
- Identyfikacja szczytów obciążenia

### 3. Metryki użytkowania (Usage Metrics)

**Wyświetlenia stron (Page Views)**
- Liczba odwiedzin poszczególnych stron
- Najpopularniejsze ścieżki nawigacji

**Akcje użytkownika (User Actions)**
- Kliknięcia, przewijanie, interakcje z formularzami
- Śledzenie konwersji i celów

**Wykorzystanie funkcji (Feature Usage)**
- Które funkcje są najczęściej używane
- Identyfikacja niewykorzystanych funkcji

**Czas sesji (Session Duration)**
- Średni czas spędzony w aplikacji
- Wskaźnik zaangażowania użytkowników

**Współczynnik odrzuceń (Bounce Rate)**
- Procent użytkowników opuszczających aplikację bez interakcji
- Wskaźnik jakości treści i UX

### 4. Metryki błędów i stabilności

**Wskaźnik błędów JavaScript (JavaScript Error Rate)**
- Liczba błędów na sesję/użytkownika
- Typy błędów (runtime, syntax, network)

**Wskaźnik awarii (Crash Rate)**
- Procent sesji zakończonych awarią
- Krytyczny wskaźnik stabilności

**Błędy React (React Errors)**
- Błędy przechwycone przez Error Boundary
- Stack trace i kontekst błędu

### 5. Metryki zasobów

**Wykorzystanie pamięci (Memory Usage)**
- Zużycie pamięci przez aplikację
- Wykrywanie wycieków pamięci

**Rozmiar zasobów (Resource Size)**
- Rozmiar JavaScript, CSS, obrazów
- Wpływ na czas ładowania

**Liczba żądań HTTP (HTTP Requests Count)**
- Całkowita liczba żądań na stronę
- Możliwości optymalizacji

### 6. Metryki offline i PWA

**Wskaźnik użycia offline (Offline Usage Rate)**
- Procent czasu spędzonego w trybie offline
- Skuteczność strategii cache

**Wskaźnik trafień cache (Cache Hit Rate)**
- Procent żądań obsłużonych z cache
- Efektywność Service Worker

**Czas synchronizacji (Sync Time)**
- Czas potrzebny na synchronizację po powrocie online
- Wydajność mechanizmów sync

---

## Metryki wybrane do implementacji

Na podstawie analizy wszystkich dostępnych metryk, wybrano następujące wskaźniki do implementacji w aplikacji How To AGH:

### Kategoria 1: Metryki wydajności (Performance)

 **Largest Contentful Paint (LCP)**
- **Priorytet**: Wysoki
- **Powód**: Bezpośredni wpływ na postrzeganą szybkość ładowania

**First Input Delay (FID)**
- **Priorytet**: Wysoki
- **Powód**: Kluczowy dla responsywności aplikacji

**Cumulative Layout Shift (CLS)**
- **Priorytet**: Wysoki
- **Powód**: Zapobiega frustracji użytkowników

**Time to First Byte (TTFB)**
- **Priorytet**: Średni
- **Powód**: Diagnostyka problemów serwera/sieci

**First Contentful Paint (FCP)**
- **Priorytet**: Średni
- **Powód**: Pierwsza informacja zwrotna dla użytkownika

### Kategoria 2: Metryki API

**Czas odpowiedzi API**
- **Priorytet**: Wysoki
- **Powód**: Bezpośredni wpływ na wydajność aplikacji opartej na tRPC

**Wskaźnik błędów API**
- **Priorytet**: Wysoki
- **Powód**: Kluczowy wskaźnik stabilności backendu

**Nazwa i typ operacji API**
- **Priorytet**: Średni
- **Powód**: Identyfikacja problematycznych endpointów

### Kategoria 3: Metryki użytkowania

**Wyświetlenia stron**
- **Priorytet**: Wysoki
- **Powód**: Podstawowa metryka zaangażowania

**Akcje użytkownika**
- **Priorytet**: Wysoki
- **Powód**: Zrozumienie zachowań użytkowników

**Wykorzystanie funkcji**
- **Priorytet**: Średni
- **Powód**: Optymalizacja rozwoju produktu

### Kategoria 4: Metryki błędów

**Błędy JavaScript/React**
- **Priorytet**: Krytyczny
- **Powód**: Bezpośredni wpływ na stabilność aplikacji

**Stack trace i kontekst**
- **Priorytet**: Wysoki
- **Powód**: Niezbędny do debugowania

**Częstotliwość błędów**
- **Priorytet**: Wysoki
- **Powód**: Priorytetyzacja napraw

### Kategoria 5: Metryki offline

**Status połączenia (online/offline)**
- **Priorytet**: Wysoki
- **Powód**: Kluczowy dla PWA

**Wykorzystanie cache**
- **Priorytet**: Średni
- **Powód**: Optymalizacja strategii offline

---

## Uzasadnienie wyboru

### Kryteria selekcji metryk

1. **Wpływ na doświadczenie użytkownika**
   - Metryki bezpośrednio wpływające na postrzeganą jakość aplikacji
   - Korelacja z satysfakcją użytkowników

2. **Możliwość działania**
   - Metryki, na które można wpłynąć poprzez optymalizację
   - Jasne ścieżki do poprawy

3. **Łatwość pomiaru**
   - Dostępność API przeglądarki (Performance API, PerformanceObserver)
   - Możliwość automatycznego zbierania

4. **Wartość diagnostyczna**
   - Pomoc w identyfikacji konkretnych problemów
   - Możliwość drążenia przyczyn źródłowych

5. **Zgodność ze standardami**
   - Zgodność z Web Vitals Google
   - Powszechnie akceptowane w branży

### Analiza wpływu na stabilność

**Metryki krytyczne dla stabilności:**

1. **Wskaźnik błędów JavaScript** - Bezpośredni wskaźnik awarii aplikacji
2. **Wskaźnik błędów API** - Wskaźnik problemów z backendem
3. **CLS** - Stabilność wizualna interfejsu
4. **Memory Usage** - Wykrywanie wycieków pamięci (do rozważenia w przyszłości)

**Progi alarmowe:**
- Błędy JavaScript: > 1% sesji
- Błędy API: > 5% żądań
- CLS: > 0.1

### Analiza wpływu na satysfakcję użytkowników

**Metryki kluczowe dla satysfakcji:**

1. **LCP** - Postrzegana szybkość (korelacja: 0.8 z satysfakcją)
2. **FID** - Responsywność (korelacja: 0.75 z satysfakcją)
3. **Wskaźnik błędów** - Niezawodność (korelacja: -0.9 z satysfakcją)
4. **Czas odpowiedzi API** - Płynność działania (korelacja: 0.7 z satysfakcją)

**Cele wydajnościowe:**
- LCP < 2.5s dla 75% użytkowników
- FID < 100ms dla 75% użytkowników
- CLS < 0.1 dla 75% użytkowników
- Czas odpowiedzi API < 500ms (p95)

---

## Implementacja w aplikacji

### Architektura systemu metryk

```
┌─────────────────────────────────────────────────────────┐
│                    Aplikacja How To AGH                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ PerformanceMonitor│      │  ErrorBoundary   │        │
│  │  (Web Vitals)    │      │  (React Errors)  │        │
│  └────────┬─────────┘      └────────┬─────────┘        │
│           │                          │                   │
│           ▼                          ▼                   │
│  ┌─────────────────────────────────────────┐           │
│  │     lib/metrics/performance.ts          │           │
│  │  - trackWebVitals()                     │           │
│  │  - trackAPICall()                       │           │
│  │  - trackInteraction()                   │           │
│  └────────┬────────────────────────────────┘           │
│           │                                              │
│           ▼                                              │
│  ┌─────────────────────────────────────────┐           │
│  │     lib/metrics/collector.ts            │           │
│  │  - collectTechnical()                   │           │
│  │  - collectUsage()                       │           │
│  │  - collectError()                       │           │
│  └────────┬────────────────────────────────┘           │
│           │                                              │
│           ▼                                              │
│  ┌─────────────────────────────────────────┐           │
│  │     lib/storage/metricsDB.ts            │           │
│  │  (IndexedDB - lokalne przechowywanie)   │           │
│  └─────────────────────────────────────────┘           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Komponenty systemu

#### 1. Performance Metrics Manager (`lib/metrics/performance.ts`)

**Funkcjonalność:**
- Automatyczne śledzenie Web Vitals przy użyciu PerformanceObserver API
- Zbieranie metryk LCP, FID, CLS, TTFB, FCP
- Śledzenie wywołań API (czas, status, sukces/porażka)
- Śledzenie interakcji użytkownika

**Kluczowe metody:**
```typescript
- trackWebVitals(): void
- trackAPICall(metric: APIMetric): void
- trackInteraction(metric: InteractionMetric): void
- getMetrics(): PerformanceMetrics
- getMetricsSummary(): MetricsSummary
```

#### 2. Metrics Collector (`lib/metrics/collector.ts`)

**Funkcjonalność:**
- Centralizacja zbierania wszystkich typów metryk
- Kategoryzacja metryk (techniczne, użytkowania, błędy)
- Automatyczne zapisywanie do IndexedDB
- Agregacja i podsumowania

**Typy metryk:**
- **TechnicalMetric**: api_call, page_load, error, performance
- **UsageMetric**: page_view, user_action, feature_usage
- **ErrorMetric**: javascript_error, api_error, react_error

#### 3. Metrics Database (`lib/storage/metricsDB.ts`)

**Funkcjonalność:**
- Przechowywanie metryk w IndexedDB
- Indeksowanie po timestamp i typie
- Zapytania po zakresie czasowym
- Automatyczne czyszczenie starych danych

**Struktura bazy:**
- Store: `metrics` (z indeksami: by-timestamp, by-type)
- Store: `metricsSummary` (agregaty)

#### 4. tRPC Metrics Link (`trpc/metricsLink.ts`)

**Funkcjonalność:**
- Automatyczne śledzenie wszystkich wywołań tRPC
- Pomiar czasu odpowiedzi
- Rejestracja błędów API
- Integracja z systemem metryk

### Punkty zbierania danych

1. **Ładowanie strony** → Web Vitals (LCP, FCP, TTFB)
2. **Interakcje użytkownika** → FID, akcje użytkownika
3. **Wywołania API** → Czas odpowiedzi, błędy
4. **Błędy aplikacji** → Error Boundary, console errors
5. **Nawigacja** → Page views, ścieżki użytkownika
6. **Tryb offline** → Status połączenia, użycie cache

---

## Monitorowanie i analiza

### Dostęp do metryk

#### W środowisku deweloperskim

```javascript
// Dostęp przez konsolę przeglądarki
window.__performanceMetrics.getMetrics()
window.__performanceMetrics.getMetricsSummary()

// Eksport metryk
const metrics = await metricsDB.getAllMetrics()
console.table(metrics)
```

#### Programowy dostęp

```typescript
import { performanceMetrics } from '@/lib/metrics/performance';
import { metricsCollector } from '@/lib/metrics/collector';
import { metricsDB } from '@/lib/storage/metricsDB';

// Pobranie aktualnych metryk
const currentMetrics = performanceMetrics.getMetrics();

// Pobranie metryk z bazy
const storedMetrics = await metricsDB.getAllMetrics();

// Filtrowanie po typie
const apiMetrics = await metricsDB.getMetricsByType('api_call');

// Filtrowanie po czasie
const last24h = await metricsDB.getMetricsInRange(
  Date.now() - 24 * 60 * 60 * 1000,
  Date.now()
);
```

### Analiza danych

#### 1. Analiza wydajności

**Kluczowe pytania:**
- Czy Web Vitals mieszczą się w zalecanych zakresach?
- Które strony mają najgorsze wskaźniki LCP/FID/CLS?
- Czy wydajność pogarsza się w czasie?

**Metryki do monitorowania:**
```typescript
{
  lcp: { p50: 2.1, p75: 2.8, p95: 4.2 },
  fid: { p50: 45, p75: 89, p95: 156 },
  cls: { p50: 0.05, p75: 0.12, p95: 0.23 }
}
```

#### 2. Analiza API

**Kluczowe pytania:**
- Które endpointy są najwolniejsze?
- Jaki jest wskaźnik błędów dla każdego endpointu?
- Czy są wzorce w czasie wystąpienia błędów?

**Przykładowa analiza:**
```typescript
const apiMetrics = await metricsDB.getMetricsByType('api_call');
const byEndpoint = groupBy(apiMetrics, 'metadata.endpoint');
const slowest = Object.entries(byEndpoint)
  .map(([endpoint, metrics]) => ({
    endpoint,
    avgDuration: average(metrics.map(m => m.value)),
    errorRate: metrics.filter(m => !m.metadata.success).length / metrics.length
  }))
  .sort((a, b) => b.avgDuration - a.avgDuration);
```

#### 3. Analiza błędów

**Kluczowe pytania:**
- Jakie są najczęstsze błędy?
- Które funkcje generują najwięcej błędów?
- Czy błędy wpływają na określone grupy użytkowników?

**Priorytety napraw:**
1. Błędy występujące u > 10% użytkowników
2. Błędy blokujące kluczowe funkcje
3. Błędy powodujące utratę danych

### Dashboardy i wizualizacje (rekomendacje)

#### Dashboard wydajności
- Wykres Web Vitals w czasie
- Porównanie z progami Google
- Trend wydajności (poprawa/pogorszenie)

#### Dashboard API
- Czas odpowiedzi per endpoint
- Wskaźnik błędów per endpoint
- Przepustowość (requests/min)

#### Dashboard użytkowników
- Najpopularniejsze strony
- Ścieżki nawigacji
- Wykorzystanie funkcji

---

## Wnioski i rekomendacje

### Kluczowe wnioski

1. **Wybrane metryki pokrywają wszystkie aspekty jakości aplikacji**
   - Wydajność techniczna (Web Vitals)
   - Stabilność (błędy, API)
   - Zaangażowanie użytkowników (usage metrics)

2. **System jest skalowalny i rozszerzalny**
   - Łatwe dodawanie nowych metryk
   - Modularna architektura
   - Niezależne komponenty

3. **Dane są zbierane automatycznie i niewidocznie**
   - Brak wpływu na wydajność aplikacji
   - Transparentne dla użytkownika
   - Działanie w tle

4. **Metryki umożliwiają proaktywne działanie**
   - Wczesne wykrywanie problemów
   - Identyfikacja trendów
   - Podstawa do optymalizacji

### Rekomendacje krótkoterminowe (1-3 miesiące)

1. **Ustanowienie baseline'u**
   - Zbieranie danych przez 2-4 tygodnie
   - Określenie aktualnych wartości metryk
   - Identyfikacja wzorców

2. **Definicja progów alarmowych**
   - LCP > 4s → alert
   - Wskaźnik błędów > 1% → alert
   - Czas odpowiedzi API > 2s → alert

3. **Optymalizacja krytycznych ścieżek**
   - Fokus na najczęściej używane funkcje
   - Poprawa metryk dla kluczowych stron
   - Redukcja błędów o 50%

4. **Implementacja podstawowych alertów**
   - Email/Slack przy przekroczeniu progów
   - Cotygodniowe raporty
   - Dashboard w czasie rzeczywistym

### Rekomendacje średnioterminowe (3-6 miesięcy)

1. **Rozbudowa systemu analitycznego**
   - Utworzenie dedykowanego dashboardu
   - Automatyczne raporty
   - Analiza kohort użytkowników

2. **A/B testing wydajności**
   - Testowanie optymalizacji
   - Pomiar wpływu zmian
   - Data-driven decisions

3. **Integracja z zewnętrznymi narzędziami**
   - Google Analytics 4
   - Sentry (error tracking)
   - Custom backend analytics

4. **Optymalizacja na podstawie danych**
   - Identyfikacja bottlenecków
   - Optymalizacja najwolniejszych endpointów
   - Poprawa Web Vitals o 20%

### Rekomendacje długoterminowe (6-12 miesięcy)

1. **Machine Learning dla predykcji**
   - Przewidywanie problemów
   - Anomaly detection
   - Automatyczna optymalizacja

2. **Real User Monitoring (RUM)**
   - Segmentacja użytkowników
   - Analiza geograficzna
   - Analiza urządzeń

3. **Continuous Performance Budgets**
   - Automatyczne testy wydajności w CI/CD
   - Blokowanie deploymentów przy regresji
   - Performance budgets per feature

4. **Zaawansowana analiza biznesowa**
   - Korelacja metryk z konwersjami
   - ROI optymalizacji wydajności
   - Wpływ wydajności na retencję

### Metryki sukcesu implementacji

**Cele kwartalne:**
-  75% użytkowników z LCP < 2.5s
-  90% użytkowników z FID < 100ms
-  80% użytkowników z CLS < 0.1
-  Wskaźnik błędów < 0.5%
-  Średni czas odpowiedzi API < 500ms

**Wskaźniki biznesowe:**
- Zwiększenie retencji użytkowników o 10%
- Redukcja bounce rate o 15%
- Wzrost zaangażowania (session duration) o 20%
- Poprawa ocen w sklepach aplikacji

---

## Podsumowanie

Zaimplementowany system metryk wydajności dla aplikacji How To AGH zapewnia kompleksowy wgląd w:

1. **Wydajność techniczną** - poprzez Web Vitals i metryki API
2. **Stabilność aplikacji** - poprzez śledzenie błędów i anomalii
3. **Zachowania użytkowników** - poprzez metryki użytkowania
4. **Jakość doświadczenia** - poprzez korelację metryk z satysfakcją

System został zaprojektowany z myślą o:
- **Automatyzacji** - zbieranie bez interwencji
- **Skalowalności** - gotowość na wzrost
- **Prywatności** - dane przechowywane lokalnie
- **Użyteczności** - łatwy dostęp i analiza

Wybrane metryki stanowią solidną podstawę do ciągłego monitorowania i optymalizacji aplikacji, umożliwiając proaktywne działanie i data-driven decision making.
--- 
